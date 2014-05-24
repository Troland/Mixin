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

// 判断数组元素是否相等
/\b(.)\1+\b/.test([1,1,1].join(''))