
import { AllToDoAccess } from "../dataLayer/AllToDoAccess";
import { createLogger } from "../utils/logger";

import * as uuid from 'uuid';

const logger = createLogger('TodosAccess')

const todoAccessLayer = new AllToDoAccess();

export const createAttachmentUrl = async (userId, todoId) => {
    logger.info("userId: ", userId, "todoId: ", todoId);
    const attachmentId = uuid.v4();

    return await todoAccessLayer.createAttachmentUrl(userId, todoId, attachmentId);
}