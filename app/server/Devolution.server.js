import db from "../db.server";
import { google } from 'googleapis'



export async function getDevolutions(graphql) {
    const devolutions = await db.devolution.findMany({
        orderBy: { createdAt: "desc" }
    });

    if (devolutions.length === 0) return [];

    return devolutions;
}


export async function getDevolutionById(devolutionId, graphql) {

    try {
      const devolution = await db.devolution.findUnique({
        where: { id: Number(devolutionId) },
        include: {
          items: true, 
          images: true, 
          resolution: {
            include: {
              images: true,
            },
          },
        },
      });
      
      // Delete on Production
      console.log('Devolution:', devolution);
      return devolution;

    } catch (error) {
      // Delete on Production
      console.error('Error fetching devolution:', error);
      return null;
    }
}

export async function updateStatus(devolutionId, status) {
    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { status: status }
        });
        
        // Delete on Production
        console.log(res);
        return res;
                
    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateSubsidiary(devolutionId, subsidiary) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { sucursal: subsidiary }
        });
        
        // Delete on Production
        console.log(res);
        return res;
                
    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateShippingPayment(devolutionId, shippingPayment) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { shippingPayment: Boolean(shippingPayment) }
        });
        
        // Delete on Production
        console.log(res);
        return res;
                
    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateShippingLabel(devolutionId, shippingLabel) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { returnmentLabel: shippingLabel }
        });
        
        // Delete on Production
        console.log(res);
        return res;
                
    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateRequiresLabel(devolutionId, requiereLabel) {

    try {

        const res = await db.devolution.update({
            where: { id: Number(devolutionId) },
            data: { requiresLabel: Boolean(requiereLabel) }
        });
        
        // Delete on Production
        console.log(res);
        return res;
                
    } catch (error) {

        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }
}

export async function updateResolution(resolutionId,comment, note, images) {

  
    try {

        images = images.split(",");
        
        const updatedResolution = await db.resolution.update({
            where: { id: Number(resolutionId) },
            data: {
              comentarios: comment,
              ndc: note,
            },
          });
        
          await db.resolutionImage.deleteMany({
            where: { resolutionId: Number(resolutionId) },
          });

        
          const newImageRecords = images.map(image => ({
            resolutionId: Number(resolutionId),
            image: image,
          }));
        
          await db.resolutionImage.createMany({
            data: newImageRecords,
          });
        
          return updatedResolution;

    } catch (error) {
        
        // Delete on Production
        console.error('Error fetching devolution:', error);
        return null;

    }

}



