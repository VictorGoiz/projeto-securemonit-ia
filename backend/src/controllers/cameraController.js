import { cameraService } from '../services/cameraService.js';

export const cameraController = {
  getAllCameras: (req, res) => {
    try {
      const cameras = cameraService.getAll();
      return res.status(200).json({
        success: true,
        count: cameras.length,
        data: cameras
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao listar câmeras',
        error: error.message
      });
    }
  },

  getCameraById: (req, res) => {
    try {
      const { id } = req.params;
      const camera = cameraService.getById(id);

      if (!camera) {
        return res.status(404).json({
          success: false,
          message: `Câmera com identificador "${id}" não encontrada`
        });
      }

      return res.status(200).json({
        success: true,
        data: camera
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Erro ao buscar câmera',
        error: error.message
      });
    }
  }
};

export default cameraController;
