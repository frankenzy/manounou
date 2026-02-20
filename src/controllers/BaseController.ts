import { NextApiRequest, NextApiResponse } from 'next';

export abstract class BaseController {
  /**
   * Wrapper pour gérer automatiquement les erreurs
   */
  protected async handleRequest(
    _req: NextApiRequest,
    res: NextApiResponse,
    handler: () => Promise<unknown>
  ): Promise<void> {
    try {
      const result = await handler();

      if (result === null || result === undefined) {
        this.sendNotFound(res);
      } else {
        this.sendSuccess(res, result);
      }
    } catch (error) {
      this.handleError(res, error);
    }
  }

  /**
   * Envoie une réponse de succès
   */
  protected sendSuccess(
    res: NextApiResponse,
    data: unknown,
    statusCode: number = 200,
    message?: string
  ): void {
    const response: Record<string, unknown> = {
      success: true,
      data,
    };

    if (message) {
      response.message = message;
    }

    if (Array.isArray(data)) {
      response.count = data.length;
    }

    res.status(statusCode).json(response);
  }

  /**
   * Envoie une réponse de création réussie
   */
  protected sendCreated(res: NextApiResponse, data: unknown, message?: string): void {
    this.sendSuccess(res, data, 201, message || 'Resource created successfully');
  }

  /**
   * Envoie une réponse 404
   */
  protected sendNotFound(res: NextApiResponse, message: string = 'Resource not found'): void {
    res.status(404).json({
      success: false,
      message,
    });
  }

  /**
   * Envoie une réponse d'erreur de validation
   */
  protected sendValidationError(res: NextApiResponse, message: string): void {
    res.status(400).json({
      success: false,
      message: 'Validation error',
      error: message,
    });
  }

  /**
   * Envoie une réponse de conflit
   */
  protected sendConflict(res: NextApiResponse, message: string): void {
    res.status(409).json({
      success: false,
      message,
    });
  }

  /**
   * Gestion centralisée des erreurs
   */
  protected handleError(res: NextApiResponse, error: unknown): void {
    console.error('Controller Error:', error);

    if (error instanceof Error) {
      // Erreur de ressource non trouvée
      if (error.message.toLowerCase().includes('not found')) {
        return this.sendNotFound(res, error.message);
      }

      // Erreur de conflit (duplication)
      if (error.message.toLowerCase().includes('already exists')) {
        return this.sendConflict(res, error.message);
      }

      // Erreur de validation
      if (
        error.message.toLowerCase().includes('validation') ||
        error.message.toLowerCase().includes('required')
      ) {
        return this.sendValidationError(res, error.message);
      }
    }

    // Erreur serveur générique
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }

  /**
   * Parse et valide un ID depuis les query params
   */
  protected parseId(req: NextApiRequest): number {
    const id = parseInt(req.query.id as string, 10);

    if (isNaN(id)) {
      throw new Error('Invalid ID provided');
    }

    return id;
  }

  /**
   * Récupère le body de la requête
   */
  protected getBody<T>(req: NextApiRequest): T {
    return req.body as T;
  }
}
