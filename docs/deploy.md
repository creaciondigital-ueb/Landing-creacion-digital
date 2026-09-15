# Deploy — Landing Creación Digital

> Última actualización: sep. 2026 — se eliminó el backend/Galería 3D del proyecto (ver auditoría técnica). Este documento describía antes la infraestructura de esa API (PostgreSQL, endpoints, PM2); esas secciones se quitaron porque ya no existen. Lo que queda es sólo lo necesario para desplegar el sitio estático actual.

## Infraestructura

| Servicio | Proveedor | Detalle |
|----------|-----------|---------|
| **Droplet** | DigitalOcean | Ubuntu 24.04, 1 vCPU, 1GB RAM |
| **IP** | `159.203.189.167` |
| **Dominio** | `creaciondigital.online` (Hostinger → NS de DigitalOcean) |
| **SSL** | Let's Encrypt, auto-renovación |
| **Dominio anterior** | `ceopacademia.org` — DEPRECADO desde 2026-06-09. No tiene relación con este sitio; no usarlo en ningún link ni referencia nueva. |

> 🔍 **Pendiente de verificar en el droplet** (no comprobable desde el código): que el `server_name` y el certificado SSL de Nginx correspondan realmente a `creaciondigital.online`, y no solo al dominio anterior — ver auditoría técnica de sep. 2026.

## Credenciales del Droplet

### SSH
```
Host: 159.203.189.167
User: root
Auth: SSH key (PC del profesor ya autorizado)
```

> **🔒 Credenciales sensibles** — NUNCA commitear valores reales en este archivo ni en ningún otro del repo.

## Estructura en el Droplet

```
/var/www/galeria-frontend/          ← Build estático de este sitio (dist/)
/etc/nginx/sites-available/galeria  ← Config Nginx
```

> El nombre `galeria-frontend` es histórico (de cuando el proyecto se llamaba Galería 3D) — sigue siendo la carpeta real en el droplet, no hace falta renombrarla para que el sitio actual funcione.

## Servicios

| Servicio | Gestión | Puerto |
|----------|---------|--------|
| **Nginx** | `systemctl restart nginx` | 80/443 |

## Deploy del Frontend

```bash
npm run build
scp -r dist/* root@159.203.189.167:/var/www/galeria-frontend/
```

Sin CI/CD — proceso 100% manual. Ver `README.md` → Ramas para el flujo `develop` → `main` antes de este paso.

## Nginx — qué debería tener

El sitio es 100% estático: no hay `/api` ni `/cdn` que proxear (esas ubicaciones eran del backend que ya no existe — si la config real del servidor todavía las tiene, se pueden quitar con seguridad la próxima vez que alguien con acceso SSH entre a limpiarla).

```nginx
server {
    listen 80;
    server_name creaciondigital.online www.creaciondigital.online;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name creaciondigital.online www.creaciondigital.online;
    ssl_certificate /etc/letsencrypt/live/creaciondigital.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/creaciondigital.online/privkey.pem;
    root /var/www/galeria-frontend;
    index index.html;

    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff2|woff|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

> Esto es lo que la config *debería* ser para un sitio estático — no es una copia confirmada de lo que hay hoy en el droplet. La auditoría técnica de sep. 2026 encontró que la config documentada anteriormente todavía apuntaba al dominio viejo y no tenía cabeceras de seguridad (HSTS, X-Frame-Options, etc.) ni compresión gzip/brotli; alguien con acceso SSH debería confirmar y ajustar la config real.

## Monitoreo

```bash
ssh root@159.203.189.167
systemctl status nginx
curl -I https://creaciondigital.online
```
