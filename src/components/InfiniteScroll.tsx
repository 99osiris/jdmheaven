import React from 'react';
import { useInView } from 'react-intersection-observer';

interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export const InfiniteScroll: React.FC<InfiniteScrollProps> = ({
  onLoadMore,
  hasMore,
  loading = false,
  children,
}) => {
  const { ref, inView } = useInView({
    threshold: 0,
  });

  React.useEffect(() => {
    if (inView && hasMore && !loading) {
      onLoadMore();
    }
  }, [inView, hasMore, loading, onLoadMore]);

  return (
    <>
      {children}
      {(hasMore || loading) && (
        <div ref={ref} className="w-full py-8 flex justify-center">
          {loading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-racing-red"></div>
          ) : (
            <div className="h-8"></div>
          )}
        </div>
      )}
    </>
  );
};