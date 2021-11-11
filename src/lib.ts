export function formatDate(date: Date) {
    const convertToTwoDigits = (n:number) => n.toLocaleString(undefined,{
        minimumIntegerDigits: 2,
    });

    return `${convertToTwoDigits(date.getMonth()+1)}/${convertToTwoDigits(date.getDate())}`;
}