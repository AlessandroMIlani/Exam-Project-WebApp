
const firstCol = 'A';


function getCoodinates(seatNumber, columns) {
    const row = Math.floor((seatNumber - 1) / columns);
    const col = (seatNumber - 1) % columns;
    const letter = String.fromCharCode(firstCol.charCodeAt(0) + col);
    return { row, letter };
  }

  function getSeat(seatNumber, columns) {
    const { row, letter } = getCoodinates(seatNumber, columns);
    return `${row + 1}-${letter}`;
  }


export { getSeat, getCoodinates };