import { AllToDoAccess } from '../dataLayer/AllToDoAccess'

const allToDoAccess = new AllToDoAccess()

export function uploadUrlImage(todoId: string): Promise<string> {
    return allToDoAccess.uploadUrlImage(todoId)
  }