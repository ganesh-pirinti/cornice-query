import { useEffect } from 'react';

interface MetaConfig {
  title?: string;
  description?: string;
}

export function useSetDocumentTitle({
  title = 'Cornice & Query — Explore. Build. Query.',
  description = 'Explore projects, UI experiments, web builds and source code from Cornice & Query social media posts.',
}: MetaConfig) {
  useEffect(() => {
    // Set document title
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);
  }, [title, description]);
}
