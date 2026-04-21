from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import admin, auth, chat, history, stats, transcribe

def create_app() -> FastAPI:
    app = FastAPI(title="TranspoBot API", version="1.0.0")

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(admin.fleet_router)
    app.include_router(admin.users_router)
    app.include_router(auth.router)
    app.include_router(chat.router)
    app.include_router(history.router)
    app.include_router(stats.router)
    app.include_router(stats.health_router)
    app.include_router(transcribe.router)

    return app

app = create_app()

from fastapi.responses import RedirectResponse

@app.get("/")
def read_root():
    return RedirectResponse(url="/docs")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
