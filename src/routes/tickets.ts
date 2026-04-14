import { Router, Request, Response, NextFunction } from 'express';
import { ticketService } from '../services/ticketService';
import { createTicketSchema, ticketReplySchema } from '../utils/validators';
import type { ApiResponse } from '../types';

const router = Router();

/**
 * POST /tickets
 * Cria um ticket no MAXIS originado pelo ViaHub.
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = createTicketSchema.parse(req.body);
    const result = await ticketService.createTicket(payload);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /tickets/:ticketId/messages
 * Retorna as mensagens de um ticket (excluindo notas internas).
 */
router.get('/:ticketId/messages', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { ticketId } = req.params;
    const result = await ticketService.getMessages(ticketId);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * POST /tickets/reply
 * Cliente responde a um ticket via ViaHub.
 */
router.post('/reply', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = ticketReplySchema.parse(req.body);
    const result = await ticketService.replyToTicket(payload);

    const response: ApiResponse = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
