const intlFormatter = fmt => x => fmt.format(x);

export default intlFormatter(new Intl.NumberFormat(undefined, {maximumFractionDigits: 1}));
