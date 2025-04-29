
import { create } from 'zustand'
import { nanoid } from 'nanoid'
import { TPcComponent } from './pcComponents'

export interface PcBuild {
    id: string
    name: string
    components: TPcComponent[]
}

interface PcBuildStore {
    builds: PcBuild[]             // Danh sách các build
    currentBuildId: string | null // ID của build hiện tại
    addBuild: (build: PcBuild) => void
    removeBuild: (id: string) => void
    setCurrentBuild: (id: string) => void
    addComponentToCurrent: (component: TPcComponent) => void
    removeComponentFromCurrent: (type: string) => void
    getCurrentBuild: () => PcBuild | undefined
    getTotalPrice: () => number
    getAllBuilds: () => PcBuild[]
    hasComponent: (component: TPcComponent) => boolean
    getComponentByType: (type: TPcComponent['type']) => TPcComponent | undefined
}


export const usePcBuildStore = create<PcBuildStore>((set, get) => ({
    builds: [],
    currentBuildId: null,

    addBuild: (build) =>
        set((state) => ({
            builds: [...state.builds, build],
            currentBuildId: build.id, // optionally select it
        })),

    removeBuild: (id) =>
        set((state) => ({
            builds: state.builds.filter((b) => b.id !== id),
            currentBuildId: state.currentBuildId === id ? null : state.currentBuildId,
        })),

    setCurrentBuild: (id) =>
        set(() => ({ currentBuildId: id })),

    addComponentToCurrent: (component) => {
        const state = get()
        const updatedBuilds = state.builds.map((build) =>
            build.id === state.currentBuildId
                ? {
                    ...build,
                    components: [
                        ...build.components.filter((c) => c.type !== component.type),
                        component,
                    ],
                }
                : build
        )
        set({ builds: updatedBuilds })
    },

    removeComponentFromCurrent: (type) => {
        const state = get()
        const updatedBuilds = state.builds.map((build) =>
            build.id === state.currentBuildId
                ? {
                    ...build,
                    components: build.components.filter((c) => c.type !== type),
                }
                : build
        )
        set({ builds: updatedBuilds })
    },

    getCurrentBuild: () => {
        const state = get()
        return state.builds.find((b) => b.id === state.currentBuildId)
    },

    getTotalPrice: () => {
        const build = get().getCurrentBuild()
        return build ? build.components.reduce((sum, c) => sum + c.price, 0) : 0
    },

    getAllBuilds: () => {
        const state = get()
        return state.builds
    },

    hasComponent: (component) => {
        const state = get()
        const currentBuild = state.builds.find((b) => b.id === state.currentBuildId)
        return currentBuild?.components.some((c) => c.id === component.id) ?? false
    },

    getComponentByType: (type) => {
        const state = get()
        const currentBuild = state.builds.find((b) => b.id === state.currentBuildId)
        return currentBuild?.components.find((comp) => comp.type === type)
    },
}))
