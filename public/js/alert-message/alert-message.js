function alertMessage(type, title, description) {
  let alertDiv;

  if (type == "error") {
    const html = `
    <div id="alert-message" aria-live="assertive" class="pointer-events-none z-10 fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-20">
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg id="svg-error" class="h-6 w-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.5 11.5L14.5 14.5L9.5 9.5L12 12L9.5 14.5L14.5 9.5M21 12C21 13.1819 20.7672 14.3522 20.3149 15.4442C19.8626 16.5361 19.1997 17.5282 18.364 18.364C17.5282 19.1997 16.5361 19.8626 15.4442 20.3149C14.3522 20.7672 13.1819 21 12 21C10.8181 21 9.64778 20.7672 8.55585 20.3149C7.46392 19.8626 6.47177 19.1997 5.63604 18.364C4.80031 17.5282 4.13738 16.5361 3.68508 15.4442C3.23279 14.3522 3 13.1819 3 12C3 9.61305 3.94821 7.32387 5.63604 5.63604C7.32387 3.94821 9.61305 3 12 3C14.3869 3 16.6761 3.94821 18.364 5.63604C20.0518 7.32387 21 9.61305 21 12Z" stroke="#D30909" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>                                                    
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p id="title-alert" class="text-sm font-medium inter">${title}</p>
                <p id="description-alert" class="mt-1 text-sm text-gray-500 inter">${description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    alertDiv = doc.getElementById("alert-message");
    
    document.body.appendChild(alertDiv);
  } else if (type == "success") {
    const html = `
    <div id="alert-message" aria-live="assertive" class="pointer-events-none z-10 fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-20">
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg id="svg-alert" class="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>                                                    
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p id="title-alert" class="text-sm font-medium inter">${title}</p>
                <p id="description-alert" class="mt-1 text-sm text-gray-500 inter">${description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    alertDiv = doc.getElementById("alert-message");
    
    document.body.appendChild(alertDiv);
  }

  setTimeout(() => {
    if (alertDiv) {
      alertDiv.style.animation = "slideoff 2s";
      setTimeout(() => {
        alertDiv.remove();
      }, 800);
    }
  }, 3000);
}