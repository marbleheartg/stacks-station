export default function clientErrorHandling() {
  function reportClientError(params: unknown) {
    fetch("/api/clientError", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    }).catch(() => {})
  }

  const originalOnError = window.onerror

  window.onerror = (message, source, lineno, colno, error) => {
    reportClientError({
      type: "js-error",
      ua: navigator.userAgent,
      message,
      source,
      lineno,
      colno,
      stack: error?.stack,
    })
    if (originalOnError) {
      originalOnError(message, source, lineno, colno, error)
    }
  }

  const errorHandler = (event: ErrorEvent | Event) => {
    const target = event.target as HTMLElement

    if (event instanceof ErrorEvent) {
      reportClientError({
        type: "runtime-error",
        ua: navigator.userAgent,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      })
    } else {
      if (["IMG", "LINK"].includes(target.tagName)) return

      reportClientError({
        type: "resource-error",
        ua: navigator.userAgent,
        tagName: target.tagName,
        src: (target as HTMLImageElement).src || (target as HTMLLinkElement).href || undefined,
        outerHTML: target.outerHTML?.slice(0, 300),
      })
    }
  }

  window.addEventListener("error", errorHandler, true)

  const unhandledRejectionHandler = (event: PromiseRejectionEvent) => {
    const reason = event.reason

    reportClientError({
      type: "unhandledrejection",
      ua: navigator.userAgent,
      message: reason?.message || String(reason),
      stack: reason?.stack || null,
    })
  }

  window.addEventListener("unhandledrejection", unhandledRejectionHandler)

  return () => {
    window.onerror = originalOnError
    window.removeEventListener("error", errorHandler, true)
    window.removeEventListener("unhandledrejection", unhandledRejectionHandler)
  }
}
