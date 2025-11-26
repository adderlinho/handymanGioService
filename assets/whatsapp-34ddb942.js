function o(e,n="1"){let t=e.replace(/\D/g,"");if(t.length===10)t=n+t;else if(!(t.length===11&&t.startsWith(n)))return null;return t}function a(e,n){const t=o(e);if(!t)return null;const s=encodeURIComponent(n);return`https://api.whatsapp.com/send/?phone=${t}&text=${s}&type=phone_number&app_absent=0`}function r(e){return`https://api.whatsapp.com/send/?text=${encodeURIComponent(e)}`}function i(e){const n=e.workers.length?e.workers.map(s=>`- ${s}`).join(`
`):"- Sin trabajadores asignados",t=`*REPORTE DE TRABAJO COMPLETADO*

*Cliente:* ${e.customerName}
*Trabajo:* ${e.serviceName}
*Fecha:* ${e.date}
*Estado:* ${e.status}

*Descripción:*
${e.description}

*Dirección:*
${e.address}

*Trabajadores asignados:*
${n}

*Precio total:* $${e.totalAmount.toFixed(2)}

*Fotos del trabajo:* ${e.photosCount} foto(s) adjunta(s)

Gracias por confiar en nuestros servicios.`;return a(e.phone,t)}export{i as buildJobReportWhatsAppUrl,a as buildWhatsAppLink,r as buildWhatsAppShareLink,o as normalizePhoneForWhatsApp};
