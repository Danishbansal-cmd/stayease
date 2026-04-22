export function successResponse(message: string, data: any = null){
    return Response.json(
        {
            status: "success",
            message,
            data,
        },
        {
            status: 200
        }
    )
}

export function errorResponse(message: string, statusCode: number) {
  return Response.json(
    {
      status: "error",
      message,
      data: null,
    },
    { status: statusCode }
  );
}

