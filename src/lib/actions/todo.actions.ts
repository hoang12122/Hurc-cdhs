'use server';

import { revalidatePath } from 'next/cache';
// using dbProvider instead
import { TodoTask, TodoPriority, TodoVisibility, User, Comment, ImageAttachment, TaskAction, TaskActivity, TodoStatus } from '../types';
import { requireAuth } from '../auth-enforcer';
import { logSystemEvent } from './system.actions';
import { dbProvider } from '../services/db-wrapper';
import { getAccounts } from '../services/account-service';

/**
 * Helper to log task activity
 */
async function logTaskActivity(todoId: string, user: { id: string; name: string }, action: TaskAction, details: string) {
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) return;
    
    const activity: TaskActivity = {
        id: `act-${Date.now()}-${require('crypto').randomBytes(3).toString('hex')}`,
        timestamp: new Date().toISOString(),
        userId: user.id,
        userName: user.name,
        action,
        details
    };
    
    let history = typeof task.activityHistory === 'string' ? JSON.parse(task.activityHistory) : (task.activityHistory || []);
    history.push(activity);
    
    await dbProvider.update('Task', todoId, { activityHistory: JSON.stringify(history) });
}

/**
 * Aggregate parent progress based on children
 */
async function aggregateParentProgress(parentId: string) {
    const children = await dbProvider.findMany<any>('Task', { parentId });
    if (!children || children.length === 0) return;
    
    const totalProgress = children.reduce((sum: number, child: any) => sum + (child.progress || 0), 0);
    const avgProgress = Math.round(totalProgress / children.length);
    
    const parent = await dbProvider.findUnique<any>('Task', parentId);
    if (parent) {
        const oldProgress = parent.progress;
        if (oldProgress !== avgProgress) {
            let newStatus = parent.status;
            if (avgProgress === 100) newStatus = 'Done';
            else if (avgProgress > 0 && parent.status === 'New') newStatus = 'In Progress';
            
            await dbProvider.update('Task', parentId, {
                progress: avgProgress,
                status: newStatus
            });
            
            if (parent.parentId) {
                await aggregateParentProgress(parent.parentId);
            }
        }
    }
}

/**
 * Get todos based on hierarchy with filtered comments
 */
export async function getTodos(includeAllPublic: boolean = true) {
    const user = await requireAuth();
    const tasksRaw = await dbProvider.findMany<any>('Task');
    
    // We assume JSON fallback and Prisma might return different formats for nested items.
    // For now, we adapt tasks to TodoTask structure.
    const allComments = await dbProvider.findMany<any>('Comment') || [];

    const todos = tasksRaw.map((task: any) => {
        // Handle relations manually since dbProvider doesn't support joins yet
        const taskComments = allComments.filter((c: any) => c.entityId === task.id);
        
        let attachments = typeof task.attachments === 'string' ? JSON.parse(task.attachments) : (task.attachments || []);
        let watchers = typeof task.watchers === 'string' ? JSON.parse(task.watchers) : (task.watchers || []);
        let activityHistory = typeof task.activityHistory === 'string' ? JSON.parse(task.activityHistory) : (task.activityHistory || []);

        const visibleComments = taskComments.filter((c: Comment) => {
            if (!c.isInternal) return true;
            return user.role === 'SUPER_ADMIN' || user.role === 'MANAGER';
        });

        return { ...task, comments: visibleComments, attachments, watchers, activityHistory };
    });

    return todos.filter((todo: TodoTask) => {
        if (user.role === 'SUPER_ADMIN') return true;
        if (todo.createdById === user.id || todo.assignedToId === user.id) return true;
        if (includeAllPublic && todo.visibility === 'public') return true;
        if (user.role === 'MANAGER') {
            // we should technically load all accounts here if we want to check department,
            // but for performance, we might need a different approach. Assuming it's fine for now.
            return true; // Simplified for refactor
        }
        return false;
    });
}

export async function getAssignableUsers() {
    await requireAuth();
    const accounts = await getAccounts();
    return accounts.map((u: any) => ({
        id: u._id?.toString() || u.id,
        name: u.name,
        role: u.role,
        department: u.department
    }));
}

export async function createTodo(data: {
    title: string;
    description?: string;
    priority: TodoPriority;
    dueDate: string;
    visibility: TodoVisibility;
    assignedToId?: string;
    assignedToName?: string;
    parentId?: string;
    todoType?: 'Task' | 'WorkPackage' | 'Milestone';
    department?: string;
    status?: TodoStatus;
    startDate?: string;
    estimatedHours?: number;
}) {
    const user = await requireAuth();
    
    const newTodoData = {
        title: data.title,
        description: data.description || null,
        priority: data.priority,
        dueDate: new Date(data.dueDate),
        visibility: data.visibility,
        assignedToId: data.assignedToId || null,
        assignedToName: data.assignedToName || null,
        parentId: data.parentId || null,
        todoType: data.todoType || null,
        department: data.department || null,
        status: data.status ?? 'New',
        progress: 0,
        createdById: user.id,
        createdByName: user.name,
        startDate: data.startDate ? new Date(data.startDate) : null,
        estimatedHours: data.estimatedHours || null,
        spentHours: 0,
        watchers: JSON.stringify([user.id]),
        activityHistory: JSON.stringify([{
            id: `act-${Date.now()}`,
            timestamp: new Date().toISOString(),
            userId: user.id,
            userName: user.name,
            action: 'CREATED',
            details: `Nhiệm vụ đã được khởi tạo: "${data.title}"`
        }]),
        attachments: JSON.stringify([]),
    };

    const created = await dbProvider.create<any>('Task', newTodoData);

    if (data.assignedToId && data.assignedToId !== user.id) {
        await dbProvider.create('Notification', {
            message: `${user.name} đã giao nhiệm vụ mới cho bạn: "${data.title}"`,
            type: 'info',
            isRead: false,
            link: '/tasks'
        });
    }

    await logSystemEvent('TODO_CREATED', 'INFO', `New ${data.visibility} task created: ${data.title}`);
    
    // Recalculate parent progress if this is a sub‑task
    if (data.parentId) {
        await aggregateParentProgress(data.parentId);
    }
    
    revalidatePath('/tasks');
    return created;
}

export async function addTodoComment(todoId: string, content: string, isInternal: boolean = false) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    
    if (!task) throw new Error('Task not found');
    
    const newComment = {
        entityId: todoId,
        senderId: user.id,
        senderName: user.name,
        timestamp: new Date().toISOString(),
        content,
        isInternal
    };
    
    const created = await dbProvider.create('Comment', newComment);
    
    await logTaskActivity(todoId, user, 'COMMENT_ADDED', isInternal ? "Đã thêm một thảo luận nội bộ." : "Đã thêm một bình luận công khai.");
    
    const recipientId = (user.id === task.createdById) ? task.assignedToId : task.createdById;

    if (recipientId && recipientId !== user.id) {
        // Find recipient account
        const allAccounts = await getAccounts();
        const recipient = allAccounts.find((u: any) => (u._id?.toString() || u.id) === recipientId);
        const canSeeInternal = recipient?.role === 'SUPER_ADMIN' || recipient?.role === 'MANAGER';
        
        if (!isInternal || canSeeInternal) {
            await dbProvider.create('Notification', {
                message: `${user.name} đã gửi một tin nhắn mới trong công việc: "${task.title}"`,
                type: isInternal ? 'warning' : 'info',
                isRead: false,
                link: '/tasks'
            });
        }
    }

    revalidatePath('/tasks');
    return created;
}

export async function addTodoAttachment(todoId: string, attachment: Omit<ImageAttachment, 'id'>) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) throw new Error('Task not found');
    
    const newAttachment: ImageAttachment = {
        id: `att-${Date.now()}`,
        ...attachment
    };
    
    let attachments = typeof task.attachments === 'string' ? JSON.parse(task.attachments) : (task.attachments || []);
    attachments.push(newAttachment);
    
    await dbProvider.update('Task', todoId, { attachments: JSON.stringify(attachments) });
    await logTaskActivity(todoId, user, 'ATTACHMENT_ADDED', `Đã tải lên tệp đính kèm: ${attachment.name}`);
    
    revalidatePath('/tasks');
    return newAttachment;
}

export async function deleteTodoAttachment(todoId: string, attachmentId: string) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) throw new Error('Task not found');
    
    const isOwner = task.createdById === user.id;
    const isSuper = user.role === 'SUPER_ADMIN';
    // const isManagerOfOwner = user.role === 'MANAGER' && ...
    if (!isOwner && !isSuper) throw new Error('Unauthorized');
    
    let attachments = typeof task.attachments === 'string' ? JSON.parse(task.attachments) : (task.attachments || []);
    const att = attachments.find((a: ImageAttachment) => a.id === attachmentId);
    attachments = attachments.filter((a: ImageAttachment) => a.id !== attachmentId);
    
    await dbProvider.update('Task', todoId, { attachments: JSON.stringify(attachments) });
    await logTaskActivity(todoId, user, 'ATTACHMENT_ADDED', `Đã xóa tệp đính kèm: ${att?.name || 'không xác định'}`);
    
    revalidatePath('/tasks');
}

export async function updateTodoAttachment(todoId: string, attachmentId: string, newName: string) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) throw new Error('Task not found');
    
    const isOwner = task.createdById === user.id;
    const isSuper = user.role === 'SUPER_ADMIN';
    if (!isOwner && !isSuper) throw new Error('Unauthorized');
    
    let attachments = typeof task.attachments === 'string' ? JSON.parse(task.attachments) : (task.attachments || []);
    const attIndex = attachments.findIndex((a: ImageAttachment) => a.id === attachmentId);
    if (attIndex === -1) throw new Error('Attachment not found');
    
    const oldName = attachments[attIndex].name;
    attachments[attIndex].name = newName;
    
    await dbProvider.update('Task', todoId, { attachments: JSON.stringify(attachments) });
    await logTaskActivity(todoId, user, 'ATTACHMENT_ADDED', `Đã đổi tên tệp đính kèm từ "${oldName}" thành "${newName}"`);
    
    revalidatePath('/tasks');
}

export async function updateTodo(id: string, data: Partial<TodoTask>) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', id);
    if (!task) throw new Error('Task not found');
    
    const isOwner = task.createdById === user.id;
    const isSuper = user.role === 'SUPER_ADMIN';
    if (!isOwner && !isSuper) throw new Error('Unauthorized'); // Simplified role check
    
    if (data.status && data.status !== task.status) {
        await logTaskActivity(id, user, 'STATUS_CHANGED', `Thay đổi trạng thái từ "${task.status}" sang "${data.status}"`);
    }
    if (data.assignedToId && data.assignedToId !== task.assignedToId) {
        await logTaskActivity(id, user, 'ASSIGNEE_CHANGED', `Thay đổi người thực hiện sang "${data.assignedToName}"`);
    }
    if (data.progress !== undefined && data.progress !== task.progress) {
        await logTaskActivity(id, user, 'PROGRESS_UPDATED', `Cập nhật tiến độ thành ${data.progress}%`);
    }

    const updateData: any = { ...data, updatedAt: new Date().toISOString() };
    
    if (data.progress !== undefined) {
        if (updateData.progress === 100) updateData.status = 'Done';
        else if (updateData.progress > 0) updateData.status = 'In Progress';
        else updateData.status = 'New';
    }
    
    await dbProvider.update('Task', id, updateData);
    
    if (task.parentId) {
        await aggregateParentProgress(task.parentId);
    }
    revalidatePath('/tasks');
}

export async function deleteTodo(id: string) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', id);
    if (!task) return;

    const isOwner = task.createdById === user.id;
    const isSuper = user.role === 'SUPER_ADMIN';
    if (!isOwner && !isSuper) throw new Error('Unauthorized');

    const parentId = task.parentId;
    await dbProvider.delete('Task', id);
    
    if (parentId) {
        await aggregateParentProgress(parentId);
    }
    revalidatePath('/tasks');
}

export async function checkTodoDeadlines() {
    const tasks = await dbProvider.findMany<any>('Task');
    const now = new Date();
    const ONE_DAY_MS = 24 * 60 * 60 * 1000;

    let updated = false;
    for (const todo of tasks) {
        if (todo.status !== 'Done' && !todo.isNotified24h) {
            const due = new Date(todo.dueDate);
            const diff = due.getTime() - now.getTime();
            if (diff > 0 && diff < ONE_DAY_MS) {
                await dbProvider.create('Notification', {
                    message: `Sắp đến hạn chót: "${todo.title}"`,
                    type: 'warning',
                    isRead: false,
                    link: '/tasks'
                });
                await dbProvider.update('Task', todo.id, { isNotified24h: true });
                updated = true;
            }
        }
    }
    if (updated) {
        const parents = tasks.filter((t: any) => !t.parentId);
        for (const parent of parents) {
            await aggregateParentProgress(parent.id);
        }
        revalidatePath('/tasks');
    }
}

export async function toggleWatcher(todoId: string) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) throw new Error('Task not found');
    
    let watchers = typeof task.watchers === 'string' ? JSON.parse(task.watchers) : (task.watchers || []);
    
    const isWatching = watchers.includes(user.id);
    if (isWatching) {
        watchers = watchers.filter((id: string) => id !== user.id);
        await logTaskActivity(todoId, user, 'WATCHER_TOGGLED', "Đã ngừng theo dõi nhiệm vụ.");
    } else {
        watchers.push(user.id);
        await logTaskActivity(todoId, user, 'WATCHER_TOGGLED', "Đã bắt đầu theo dõi nhiệm vụ.");
    }
    
    await dbProvider.update('Task', todoId, { watchers: JSON.stringify(watchers) });
    revalidatePath('/tasks');
    return !isWatching;
}

export async function logTime(todoId: string, hours: number, details: string) {
    const user = await requireAuth();
    const task = await dbProvider.findUnique<any>('Task', todoId);
    if (!task) throw new Error('Task not found');
    
    const spentHours = (task.spentHours || 0) + hours;
    
    await dbProvider.update('Task', todoId, { 
        spentHours,
        updatedAt: new Date().toISOString()
    });
    
    await logTaskActivity(todoId, user, 'TIME_LOGGED', `Đã ghi nhận ${hours} giờ làm việc: ${details}`);
    
    revalidatePath('/tasks');
}

