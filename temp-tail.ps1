Remove-Item Env:SSL_CERT_FILE -ErrorAction SilentlyContinue
$env:NODE_TLS_REJECT_UNAUTHORIZED='0'
$env:CLOUDFLARE_API_TOKEN='cfat_uiq35O5VC73x4KJXJsRMmKIlewznxTrwG3aArsFc78d57280'
npx wrangler tail hii --format=json --status=error --version-id='60b208dc-98f8-433b-be42-7d9f789c6c58'