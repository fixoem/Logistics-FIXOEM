import db from "../db.server";

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
  
      console.log('Devolution:', devolution);
      return devolution;

    } catch (error) {
      console.error('Error fetching devolution:', error);
      return null;
    }
}
