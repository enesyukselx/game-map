export const clearMap = ({
    ctx,
    width,
    height,
    backgroundColor,
}: {
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
    backgroundColor: string;
}) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
};
