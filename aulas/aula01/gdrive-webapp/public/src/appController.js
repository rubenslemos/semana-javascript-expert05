export default class AppController {
    constructor({ connectionManager, viewManager, dragAndDropManager }) {
        this.connectionManager = connectionManager
        this.viewManager = viewManager
        this.dragAndDropManager = dragAndDropManager
        this.uploadingFiles = new Map()
    }
    async initialize() {
        this.viewManager.configureFileBtnClick()
        this.viewManager.configureModal()
        this.viewManager.configureOnFileChange(this.onFileChange.bind(this))
        this.dragAndDropManager.initialize({
            onDropHandler: this.onFileChange.bind(this)
        })

        this.connectionManager.configureEvents(this.onProgress.bind(this))
        this.viewManager.updateStatus(0)

        await this.updateCurrentFiles()
    }

    async onProgress({ processedAlready, filename }) {
        console.debug({ processedAlready, filename })
        const file = this.uploadingFiles.get(filename)
        const alreadyProcessed = Math.ceil(processedAlready / file.size * 100)
        this.updateProgress(file, alreadyProcessed)
        if (alreadyProcessed < 98) return
        return this.updateCurrentFiles()
    }

    updateProgress(file, percent) {
        const uploadingFiles = this.uploadingFiles
        file.percent = percent
        const total = [...uploadingFiles.values()]
            .map(({ percent }) => percent ?? 0)
            .reduce((total, current) => total + current, 0)
        this.viewManager.updateStatus(total)
    }
    async onFileChange(files) {
        this.viewManager.openModal()
        this.viewManager.updateStatus(0)

        const requests = []
        for (const file of files) {
            this.uploadingFiles.set(file.name, file)
            requests.push(this.connectionManager.uploadFile(file))
        }
        await Promise.all(requests)
        this.viewManager.updateStatus(100)
        setTimeout(() => { this.viewManager.closeModal(), this.viewManager.updateStatus(0) }, 1000)
        await this.updateCurrentFiles()
    }

    async updateCurrentFiles() {
        const files = await this.connectionManager.currentFiles()
        this.viewManager.updateCurrentFiles(files)
    }
}