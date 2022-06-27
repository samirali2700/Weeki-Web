const rootUrl = process.env.HOSTNAME + ':' + process.env.PORT;

export const link = (to) => {
	return `<a target="_blank" rel="noopener" href="${rootUrl}/${to}">${rootUrl}/${to}</a>`;
};

export const button = (text, to) => {
	return `
    <div class="button" >
        <a target="_blank" rel="noopener" href="${rootUrl}/${to}" style="color: #fff;">
            ${text}
        </a>
    </div>
    `;
};
export const header = () => {
	return `
    <div class="header">    
        <div class="logo">
            <img id="logo" src="intro@logo" alt="logo">
        </div>  
    </div>  `;
};

export const footer = (to) => {
	return `
    <div class="footer text">
        <p>Denne e-mail var sendt til ${to}</p>
        <p>Weeki.dk &copy; 2022</p>
    </div>
    `;
};
