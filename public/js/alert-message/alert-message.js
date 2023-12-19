function alertMessage(type, title) {
  let alertDiv;

  if (type == "error") {
    const html = `
    <div id="alert-message" aria-live="assertive" class="pointer-events-none z-10 fixed inset-0 flex items-end px-4 py-6 sm:items-start sm:p-6 mt-20">
      <div class="flex w-full flex-col items-center space-y-4 sm:items-end">
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-red-700 shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/>
                </svg>
                <span class="sr-only">Error icon</span>                                                    
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p id="title-alert" class="text-sm font-medium text-white inter">${title}</p>
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
        <div class="pointer-events-auto w-full max-w-sm overflow-hidden rounded-lg bg-green-700 shadow-lg ring-1 ring-black ring-opacity-5">
          <div class="p-4">
            <div class="flex items-start">
              <div class="flex-shrink-0">
                <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="#fff" viewBox="0 0 20 20">
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/>
                </svg>
                <span class="sr-only">Check icon</span>                                                    
              </div>
              <div class="ml-3 w-0 flex-1 pt-0.5">
                <p id="title-alert" class="text-sm font-medium text-white inter">${title}</p>
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