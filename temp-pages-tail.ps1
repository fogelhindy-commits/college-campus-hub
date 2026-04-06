Remove-Item Env:SSL_CERT_FILE -ErrorAction SilentlyContinue
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
$env:CLOUDFLARE_API_TOKEN='cfat_DZFR0twCT6yL4HEX1ardfZeRVwXODSHMCfGkP1fie16cf58d'
npx wrangler pages deployment tail 72c0cd83 --project-name hii-pages --format json
