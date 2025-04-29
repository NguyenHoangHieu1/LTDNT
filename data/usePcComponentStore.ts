// usePcComponentStore.ts

import { create } from 'zustand'
import { TPcComponent } from './pcComponents'
import { ComponentType } from './pcComponents'

interface PcComponentState {
    components: TPcComponent[]
    addComponent: (component: TPcComponent) => void
    removeComponent: (type: ComponentType) => void
    updateComponent: (component: TPcComponent) => void
    setComponents: (components: TPcComponent[]) => void
    hasComponent: (components: TPcComponent) => boolean
    getComponentByType: (type: TPcComponent['type']) => TPcComponent | undefined
    getTotalPrice: () => number
    getAllComponents: () => TPcComponent[]
    clearComponents: () => void
}

export const usePcComponentStore = create<PcComponentState>((set, get) => ({
    components: [],

    addComponent: (newComponent) =>
        set((state) => {
            const filtered = state.components.filter(
                (comp) => comp.type !== newComponent.type
            )
            return {
                components: [...filtered, newComponent],
            }
        }),

    removeComponent: (type) =>
        set((state) => ({
            components: state.components.filter((comp) => comp.type !== type),
        })),

    updateComponent: (updatedComponent) =>
        set((state) => ({
            components: state.components.map((comp) =>
                comp.id === updatedComponent.id ? updatedComponent : comp
            ),
        })),

    setComponents: (components) => set({ components }),

    hasComponent: (component) => {
        const state = get()
        return state.components.some((comp) => comp.id === component.id)
    },
    getComponentByType: (type) => {
        const state = get()
        return state.components.find((comp) => comp.type === type)
    },
    getTotalPrice: () => {
        const state = get()
        return state.components.reduce((total, comp) => total + comp.price, 0)
    },
    getAllComponents: () => {
        const state = get()
        return state.components
    },
    clearComponents: () => set({ components: [] }),

}))
