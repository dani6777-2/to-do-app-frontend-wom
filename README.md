# Todo App Frontend

<div align="center">

![Todo App Logo](public/logo.png)

Una aplicación web moderna para la gestión de tareas, construida con React y TypeScript.

[Demo en Vivo](https://todo-app.demo.com) | [Documentación API](./api-docs.md) | [Reportar Bug](https://github.com/user/repo/issues)

</div>

## 📋 Tabla de Contenidos

- [Descripción General](#-descripción-general)
- [Características](#-características)
- [Tecnologías Utilizadas](#%EF%B8%8F-tecnologías-utilizadas)
- [Instalación y Configuración](#%EF%B8%8F-instalación-y-configuración)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Guía de Uso](#-guía-de-uso)
- [Integración con Backend](#-integración-con-backend)
- [Despliegue](#-despliegue)
- [Contribución](#-contribución)
- [Licencia](#-licencia)

## 📋 Descripción General

Esta aplicación frontend proporciona una interfaz de usuario moderna e intuitiva para un sistema de gestión de tareas, permitiendo a los usuarios organizar sus actividades de manera eficiente.

### 🎯 Funcionalidades Principales

- **Gestión de Usuarios**
  - Registro con validación en tiempo real
  - Login con autenticación JWT
  - Recuperación de contraseña
  - Perfil de usuario editable

- **Gestión de Listas**
  - Creación de múltiples listas
  - Organización por categorías
  - Compartir listas con otros usuarios
  - Estadísticas de progreso

- **Gestión de Tareas**
  - Creación y edición de tareas
  - Asignación de prioridades
  - Fechas límite con recordatorios
  - Estados personalizables

### 🎨 Características de UI/UX

- **Diseño Moderno**
  - Tema claro/oscuro
  - Animaciones suaves
  - Efectos de glassmorphism
  - Iconografía consistente

- **Experiencia de Usuario**
  - Drag & drop intuitivo
  - Atajos de teclado
  - Búsqueda instantánea
  - Filtros avanzados

## 🛠️ Tecnologías Utilizadas

### Core
- React 18
- TypeScript 5
- Vite 5
- React Router 6

### Estilos
- CSS Modules
- PostCSS
- Tailwind CSS

### Estado y Datos
- React Query
- Zustand
- Axios

### Testing
- Vitest
- React Testing Library
- Cypress

### Calidad de Código
- ESLint
- Prettier
- Husky
- Commitlint

## 📦 Instalación y Configuración

### Prerrequisitos

```bash
node -v # v18 o superior
npm -v  # v9 o superior
```

### Configuración del Entorno

1. **Clonar e Instalar**
```bash
git clone https://github.com/user/todo-app-frontend.git
cd todo-app-frontend
npm install
```

2. **Variables de Entorno**
```bash
# .env.development
VITE_API_URL=http://localhost:8000
VITE_ENV=development
VITE_LOG_LEVEL=debug

# .env.production
VITE_API_URL=https://api.production.com
VITE_ENV=production
VITE_SENTRY_DSN=https://your-sentry-dsn
```

3. **Scripts Disponibles**
```bash
npm run dev      # Desarrollo local
npm run build    # Build de producción
npm run preview  # Preview de build
npm run test     # Tests unitarios
npm run e2e      # Tests E2E
npm run lint     # Linting
npm run format   # Formateo de código
```

## 📁 Estructura del Proyecto

```
src/
├── assets/          # Recursos estáticos
├── components/      # Componentes React
│   ├── common/      # Componentes reutilizables
│   ├── features/    # Componentes específicos
│   └── layout/      # Componentes de estructura
├── hooks/           # Custom hooks
├── interfaces/      # TypeScript interfaces
├── pages/          # Componentes de página
├── services/       # Servicios API
├── store/          # Estado global
├── styles/         # Estilos globales
└── utils/          # Utilidades

```

### Componentes Principales

#### AuthProvider
```tsx
// src/providers/AuthProvider.tsx
export const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token)
        .then(user => setUser(user))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

#### ProtectedRoute
```tsx
// src/components/common/ProtectedRoute.tsx
export const ProtectedRoute: FC<PropsWithChildren> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
```

## 🎯 Guía de Uso

### Autenticación

```typescript
// Ejemplo de login
const handleLogin = async (credentials: LoginCredentials) => {
  try {
    const { token, user } = await authService.login(credentials);
    localStorage.setItem('token', token);
    setUser(user);
    navigate('/dashboard');
  } catch (error) {
    handleError(error);
  }
};
```

### Gestión de Listas

```typescript
// Crear una nueva lista
const createList = async (data: CreateListDTO) => {
  const response = await listService.createList(data);
  queryClient.invalidateQueries(['lists']);
  return response;
};

// Hook personalizado para listas
export const useListsQuery = () => {
  return useQuery(['lists'], listService.getAllLists, {
    staleTime: 5 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });
};
```

## 🔌 Integración con Backend

### Configuración de Axios

```typescript
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Ejemplos de Servicios

```typescript
// src/services/taskService.ts
export const taskService = {
  getTasks: async (listId: number, filters: TaskFilters) => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.priority) params.append('priority', filters.priority);
    
    const response = await api.get(`/lists/${listId}/tasks?${params}`);
    return response.data;
  },

  createTask: async (listId: number, data: CreateTaskDTO) => {
    const response = await api.post(`/lists/${listId}/tasks`, data);
    return response.data;
  },

  updateTask: async (taskId: number, data: UpdateTaskDTO) => {
    const response = await api.patch(`/tasks/${taskId}`, data);
    return response.data;
  },

  deleteTask: async (taskId: number) => {
    await api.delete(`/tasks/${taskId}`);
  },
};
```

## 🎨 Estilos y Temas

### Sistema de Temas

```typescript
// src/hooks/useTheme.ts
export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    localStorage.getItem('theme') as 'light' | 'dark' || 'light'
  );

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, toggleTheme };
};
```

### Variables CSS

```css
/* src/styles/variables.css */
:root {
  /* Colores */
  --color-primary: #0066cc;
  --color-secondary: #6c757d;
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;

  /* Espaciado */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Tipografía */
  --font-family: 'Inter', system-ui, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.25rem;
  --font-size-xl: 1.5rem;

  /* Bordes */
  --border-radius-sm: 4px;
  --border-radius-md: 8px;
  --border-radius-lg: 12px;

  /* Sombras */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 15px rgba(0,0,0,0.1);
}

[data-theme='dark'] {
  --color-bg: #1a1a1a;
  --color-text: #ffffff;
  /* ... más variables para tema oscuro */
}
```

## 📱 Responsive Design

### Breakpoints

```typescript
// src/hooks/useBreakpoint.ts
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
} as const;

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState(() => {
    return window.innerWidth;
  });

  useEffect(() => {
    const handleResize = () => {
      setBreakpoint(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: breakpoint < breakpoints.md,
    isTablet: breakpoint >= breakpoints.md && breakpoint < breakpoints.lg,
    isDesktop: breakpoint >= breakpoints.lg,
  };
};
```

## 🔒 Seguridad

### Protección XSS

```typescript
// src/utils/security.ts
export const sanitizeInput = (input: string): string => {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
};

export const validateInput = (input: string): boolean => {
  const pattern = /^[a-zA-Z0-9\s\-_]+$/;
  return pattern.test(input);
};
```

## 📊 Monitoreo y Analytics

```typescript
// src/utils/analytics.ts
export const logEvent = (eventName: string, data?: Record<string, any>) => {
  if (import.meta.env.PROD) {
    // Enviar a servicio de analytics
    console.log(`[${eventName}]`, data);
  }
};

export const logError = (error: Error) => {
  if (import.meta.env.PROD) {
    // Enviar a Sentry
    Sentry.captureException(error);
  }
};
```

## 🧪 Testing

### Ejemplo de Test Unitario

```typescript
// src/components/TaskList/TaskList.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { TaskList } from './TaskList';

describe('TaskList', () => {
  it('renders tasks correctly', () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: true },
    ];

    render(<TaskList tasks={tasks} />);
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  it('handles task completion toggle', () => {
    const onToggle = vi.fn();
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
    ];

    render(<TaskList tasks={tasks} onToggle={onToggle} />);
    
    fireEvent.click(screen.getByRole('checkbox'));
    expect(onToggle).toHaveBeenCalledWith(1, true);
  });
});
```

## 📦 Build y Despliegue

### Configuración de Build

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Todo App',
        short_name: 'Todo',
        theme_color: '#ffffff',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    }),
  ],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          utils: ['date-fns', 'lodash-es'],
        },
      },
    },
  },
});
```

## 🤝 Contribución

### Guía de Estilo

```typescript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
  ],
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE.md](./LICENSE.md) para más detalles.

## 🚀 Despliegue en Google Cloud Run

### Prerrequisitos

1. Cuenta de Google Cloud Platform
2. Proyecto GCP creado y configurado
3. Cloud Run API habilitada
4. Workload Identity Federation configurado
5. Permisos necesarios configurados

### Configuración de Secretos en GitHub

Necesitarás configurar los siguientes secretos en tu repositorio de GitHub:

```bash
GCP_PROJECT_ID=tu-proyecto-id
WIF_PROVIDER=projects/123456789/locations/global/workloadIdentityPools/my-pool/providers/my-provider
WIF_SERVICE_ACCOUNT=my-service-account@my-project.iam.gserviceaccount.com
```

### Configuración de Workload Identity Federation

1. Crear un pool de identidad:
```bash
gcloud iam workload-identity-pools create "github-actions-pool" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --display-name="GitHub Actions Pool"
```

2. Crear un proveedor de identidad:
```bash
gcloud iam workload-identity-pools providers create-oidc "github-provider" \
  --project="${PROJECT_ID}" \
  --location="global" \
  --workload-identity-pool="github-actions-pool" \
  --display-name="GitHub provider" \
  --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository" \
  --issuer-uri="https://token.actions.githubusercontent.com"
```

3. Crear una cuenta de servicio:
```bash
gcloud iam service-accounts create "github-actions-service-account" \
  --project="${PROJECT_ID}" \
  --description="Service account for GitHub Actions" \
  --display-name="GitHub Actions Service Account"
```

4. Configurar los permisos:
```bash
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:github-actions-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.admin"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:github-actions-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin"

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:github-actions-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/iam.serviceAccountUser"
```

5. Permitir que GitHub Actions use la cuenta de servicio:
```bash
gcloud iam service-accounts add-iam-policy-binding "github-actions-service-account@${PROJECT_ID}.iam.gserviceaccount.com" \
  --project="${PROJECT_ID}" \
  --role="roles/iam.workloadIdentityUser" \
  --member="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository/${GITHUB_REPOSITORY}"
```

### Despliegue Manual

Si necesitas desplegar manualmente, puedes usar los siguientes comandos:

```bash
# Construir la imagen
docker build -t gcr.io/${PROJECT_ID}/todo-app-frontend .

# Subir la imagen a Container Registry
docker push gcr.io/${PROJECT_ID}/todo-app-frontend

# Desplegar en Cloud Run
gcloud run deploy todo-app-frontend \
  --image gcr.io/${PROJECT_ID}/todo-app-frontend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Despliegue Automático

El despliegue automático se realiza a través de GitHub Actions cuando:

1. Se hace push a la rama principal (main/master)
2. Se activa manualmente el workflow desde la interfaz de GitHub

El proceso de despliegue incluye:

1. Pruebas y linting
2. Construcción de la imagen Docker
3. Subida de la imagen a Container Registry
4. Despliegue en Cloud Run

### Monitoreo y Logs

Para ver los logs de la aplicación:

```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=todo-app-frontend" --limit 50
```

Para monitorear el servicio:

```bash
gcloud run services describe todo-app-frontend
```
