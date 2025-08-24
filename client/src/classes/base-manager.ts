import { ErrorsViewModel } from "src/models/ErrorsViewModel";

export class BaseManager {
    listaErrori: ErrorsViewModel[] = [];
    loading: boolean = false;

    protected readonly LOCAL_STORAGE_KEY: string = '';
    protected loadingTimeout?: number;
    protected hasSaved: boolean = false;

    protected setLoadingTimeout(): void {
        if (this.loadingTimeout == null) {
            this.loadingTimeout = window.setTimeout(() => { this.loading = true; }, 500);
        }
    }

    protected clearLoadingTimeout(): void {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = undefined;
        this.loading = false;
    }
}