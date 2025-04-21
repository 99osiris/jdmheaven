import { useEffect, useRef, useState } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  root?: Element | null;
  rootMargin?: string;
  freezeOnceVisible?: boolean;
}

export const useIntersectionObserver = ({
  threshold = 0,
  root = null,
  rootMargin = '0px',
  freezeOnceVisible = true,
}: UseIntersectionObserverProps = {}) => {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();
  const [node, setNode] = useState<Element | null>(null);
  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    if (frozen || !node) return;
    
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(
      ([entry]) => setEntry(entry),
      { threshold, root, rootMargin }
    );

    observer.current.observe(node);

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [node, threshold, root, rootMargin, frozen]);

  return [setNode, entry?.isIntersecting ?? false] as const;
};