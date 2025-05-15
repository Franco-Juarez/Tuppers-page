export async function GET() {
  try {
    const inflationData = [
      { month: "Apr", inflation: 8.8 },
      { month: "May", inflation: 4.2 },
      { month: "Jun", inflation: 4.6 },
      { month: "Jul", inflation: 4.0 },
      { month: "Ago", inflation: 4.2 },
      { month: "Sep", inflation: 3.5 },
      { month: "Oct", inflation: 2.7 },
      { month: "Nov", inflation: 2.4 },
      { month: "Dic", inflation: 2.7 },
      { month: "Ene", inflation: 2.2 },
      { month: "Feb", inflation: 2.4 },
      { month: "Mar", inflation: 3.7 }
      { month: "Apr", inflation: 2.8 }
    ];

    // Calculate accumulated inflation
    let accumulatedInflation = 0;
    const dataWithAccumulated = inflationData.map(item => {
      accumulatedInflation += item.inflation;
      return {
        ...item,
        accumulatedInflation: parseFloat(accumulatedInflation.toFixed(2))
      };
    });

    return Response.json(dataWithAccumulated);
  } catch (error) {
    console.error("Error fetching inflation data:", error);
    return Response.json({ error: "Failed to fetch inflation data" }, { status: 500 });
  }
} 