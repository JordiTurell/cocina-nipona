# 🔐 Autenticación JWT - API Cocina Nipona

## 📋 Endpoints Disponibles

### 1. **Registro de Usuario**
```http
POST /api/auth/register
Content-Type: application/json

{
  "nickname": "usuario123",
  "password": "miPassword123",
  "rolId": "uuid-del-rol",
  "imageProfile": "https://example.com/image.jpg" // Opcional
}
```

**Respuesta exitosa (201):**
```json
{
  "message": "Usuario registrado exitosamente",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "nickname": "usuario123",
    "rol": "user"
  }
}
```

---

### 2. **Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "nickname": "usuario123",
  "password": "miPassword123"
}
```

**Respuesta exitosa (200):**
```json
{
  "message": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "1",
    "nickname": "usuario123",
    "rol": "user",
    "imageProfile": "https://example.com/image.jpg"
  }
}
```

---

### 3. **Obtener Perfil (Requiere Auth)**
```http
GET /api/auth/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Respuesta exitosa (200):**
```json
{
  "user": {
    "id": "1",
    "nickname": "usuario123",
    "rol": "user",
    "imageProfile": "https://example.com/image.jpg"
  }
}
```

---

### 4. **Ruta de Admin (Requiere Auth + Rol Admin)**
```http
GET /api/auth/admin
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔑 Estructura del Token JWT

El token contiene el siguiente payload:
```json
{
  "userId": "1",
  "email": "usuario123",
  "nickname": "usuario123",
  "roles": ["admin"],
  "iat": 1738281600,
  "exp": 1738368000,
  "iss": "cocina-nipona-api"
}
```

---

## 🛡️ Uso en el Frontend (Angular)

### Guardar el token:
```typescript
localStorage.setItem('auth_token', response.token);
```

### Enviar en requests:
```typescript
const headers = new HttpHeaders({
  'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
});

this.http.get('/api/auth/profile', { headers }).subscribe(...);
```

### Decodificar el token (tu método actual):
```typescript
private getTokenRoles(): string[] | null {
  const token = localStorage.getItem('auth_token');
  if (!token) return null;

  const payload = token.split('.')[1];
  if (!payload) return null;

  const decodedJson = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
  const decoded = JSON.parse(decodedJson);

  return decoded.roles || [];
}
```

---

## 🔒 Proteger Rutas en la API

### Requiere autenticación:
```typescript
import { authMiddleware } from '../middlewares/auth.middleware';

router.get('/protected', authMiddleware, (req, res) => {
  res.json({ user: req.user });
});
```

### Requiere rol específico:
```typescript
import { authMiddleware, requireRole } from '../middlewares/auth.middleware';

router.delete('/users/:id', 
  authMiddleware, 
  requireRole('admin'), 
  deleteUser
);
```

### Requiere alguno de varios roles:
```typescript
import { authMiddleware, requireAnyRole } from '../middlewares/auth.middleware';

router.post('/recipes', 
  authMiddleware, 
  requireAnyRole(['admin', 'chef']), 
  createRecipe
);
```

---

## 📦 Archivos Creados

```
api/
├── src/
│   ├── services/
│   │   └── auth.service.ts       # Lógica de JWT y bcrypt
│   ├── middlewares/
│   │   └── auth.middleware.ts    # Middlewares de autenticación
│   ├── controllers/
│   │   └── auth.controller.ts    # Controladores de auth
│   └── routes/
│       └── auth.routes.ts        # Rutas de autenticación
└── .env                           # JWT_SECRET y JWT_EXPIRES_IN
```

---

## ⚙️ Variables de Entorno

```env
JWT_SECRET=tu_clave_secreta_super_segura_cambiala_en_produccion
JWT_EXPIRES_IN=24h
```

⚠️ **IMPORTANTE:** En producción, usa una clave segura y cámbiala regularmente.

---

## 🧪 Probar con cURL

### Registro:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nickname":"test","password":"123456","rolId":"uuid-del-rol"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"nickname":"test","password":"123456"}'
```

### Perfil (reemplaza TOKEN):
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TOKEN"
```

---

## 🔐 Seguridad

✅ **Implementado:**
- Hashing de contraseñas con bcrypt (10 rounds)
- Tokens JWT firmados con secret
- Verificación de expiración de tokens
- Protección de rutas con middlewares
- Control de acceso basado en roles

⚠️ **Recomendaciones:**
- Usar HTTPS en producción
- Rotar JWT_SECRET periódicamente
- Implementar refresh tokens
- Añadir rate limiting
- Validar inputs con bibliotecas como `joi` o `zod`
