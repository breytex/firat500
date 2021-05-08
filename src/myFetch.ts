export const fetchStore = {}

export const cacheResponse = (key, data)=>{
  fetchStore[key] = data;
}

export const hydrateFetchStore = (ssrFetchStore: object)=>{
  console.log("hydrated cache client side")
  Object.assign(fetchStore, ssrFetchStore)
}

export const myFetch = async (endpoint)=>{
  
  // Dont fetch data again which is already in the cache
  if(fetchStore[endpoint]){
    console.log("Served from cache: ", endpoint)
    return fetchStore[endpoint]
  } 
  
  console.log("Fetch request: ", endpoint)
  const res = await fetch(endpoint);
  const data = await res.json();
  cacheResponse(endpoint, data);
  
  return data
}
