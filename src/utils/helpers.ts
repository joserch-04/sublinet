export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(price);
};

export const formatDate = (dateString: string): string => {
  return new Intl.DateTimeFormat('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateString));
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-700',
    processing: 'bg-blue-100 text-blue-700',
    printing: 'bg-brand-100 text-brand-700',
    shipped: 'bg-accent-violet/10 text-accent-violet',
    delivered: 'bg-green-100 text-green-700',
  };
  return colors[status] || 'bg-ink-100 text-ink-600';
};

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'Pendiente',
    processing: 'En proceso',
    printing: 'Sublimando',
    shipped: 'Enviado',
    delivered: 'Entregado',
  };
  return labels[status] || status;
};

export const cn = (...classes: (string | boolean | undefined)[]): string => {
  return classes.filter(Boolean).join(' ');
};
