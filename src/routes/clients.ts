import { Router, Request, Response, NextFunction } from 'express';
import { clientService } from '../services/clientService';
import { syncClientSchema, paginationSchema } from '../utils/validators';
import type { ApiResponse, PaginatedResponse, ClientMapping } from '../types';

const router = Router();

/**
 * POST /clients/sync
 * Sincroniza um cliente do ViaHub para o MAXIS.
 */
router.post('/sync', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = syncClientSchema.parse(req.body);
    const result = await clientService.syncClient(payload);

    const response: ApiResponse<ClientMapping> = {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /clients/mapping/:viahubId
 * Busca o mapeamento de um cliente por ID do ViaHub.
 */
router.get('/mapping/:viahubId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { viahubId } = req.params;
    const mapping = await clientService.getMapping(viahubId);

    if (!mapping) {
      res.status(404).json({
        success: false,
        error: 'Mapeamento não encontrado',
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const response: ApiResponse<ClientMapping> = {
      success: true,
      data: mapping,
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

/**
 * GET /clients/mappings
 * Lista todos os mapeamentos de clientes (paginado).
 */
router.get('/mappings', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, per_page } = paginationSchema.parse(req.query);
    const { mappings, total } = await clientService.listMappings(page, per_page);

    const response: PaginatedResponse<ClientMapping> = {
      success: true,
      data: mappings,
      pagination: {
        page,
        per_page,
        total,
        total_pages: Math.ceil(total / per_page),
      },
      timestamp: new Date().toISOString(),
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

export default router;
