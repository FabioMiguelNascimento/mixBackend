import { StorageService } from "@/services/storageService.js";

export default function makeGetImageUrls(storageService: StorageService) {
    return async function getImageUrls(keys: string[]): Promise<Record<string, string | null>> {
        return storageService.getBatchFiles(keys);
    }
}
