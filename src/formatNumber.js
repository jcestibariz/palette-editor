import intlFormatter from './intlFormatter';

export default intlFormatter(new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}));
