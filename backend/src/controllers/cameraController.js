import {
  getAllCameras as fetchAllCameras,
  getCameraById as fetchCameraById
} from '../services/cameraService.js';

// GET /api/cameras - Lista todas as câmeras cadastradas
export async function getAllCameras(req, res) {
  try {
    const cameras = await fetchAllCameras();

    return res.status(200).json({
      success: true,
      count: cameras.length,
      data: cameras
    });
  } catch (error) {
    console.error('Erro em getAllCameras:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao listar câmeras',
      error: error.message
    });
  }
}

// GET /api/cameras/:id - Busca uma câmera por ID ou código
export async function getCameraById(req, res) {
  try {
    const { id } = req.params;
    const camera = await fetchCameraById(id);

    if (!camera) {
      return res.status(404).json({
        success: false,
        message: `Câmera "${id}" não encontrada no sistema`
      });
    }

    return res.status(200).json({
      success: true,
      data: camera
    });
  } catch (error) {
    console.error('Erro em getCameraById:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro interno ao buscar câmera',
      error: error.message
    });
  }
}

export const cameraController = {
  getAllCameras,
  getCameraById
};

export default cameraController;
