import { useEffect, useMemo, useState } from 'react';
import { bfsAccessories, catalog } from '../graph';

export function useRecommendations(baseId, depth=1){
  const [result,setResult]=useState([]);
  useEffect(()=>{ if(!baseId) return; setResult(bfsAccessories(baseId, depth)); },[baseId,depth]);
  const products=useMemo(()=>result.map(id=>catalog[id]),[result]);
  return products;
}
