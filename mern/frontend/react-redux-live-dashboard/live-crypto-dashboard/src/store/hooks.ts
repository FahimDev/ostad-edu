/**
 * Typed Redux Hooks
 * 
 * These hooks provide TypeScript type safety when using Redux in components.
 * Instead of using plain useDispatch and useSelector, we use these typed versions.
 * 
 * Benefits:
 * - TypeScript knows the shape of our state
 * - Autocomplete works for state properties
 * - Type errors catch bugs at compile time
 */

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from './store'

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

