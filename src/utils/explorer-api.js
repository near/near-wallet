export async function connectWapm(wamp) {
   try {
      return await new Promise((resolve, reject) => {
         wamp.onopen = session => resolve(session)
         wamp.onclose = reason => reject(reason)
         wamp.open()
      });
   } catch (error) {
      console.error('Connection failure due to:', error)
      return
   }
}
