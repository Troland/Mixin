// commentRegExp
/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg

// cjsRequireRegExp
/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g

// isBrowser
!!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document)

// isWebWorker
!isBrowser && typeof importScripts !== 'undefined'

// readyRegExp
isBrowser && navigator.platform === 'PLAYSTATION 3' ? /^complete$/ : /^(complete|loaded)$/

// opera
typeof opera !== 'undefined' && opera.toString() === '[object Opera]'
