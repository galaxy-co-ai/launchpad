import { describe, it, expect } from "vitest"
import { cn } from "@/lib/utils"

describe("utils", () => {
  describe("cn", () => {
    it("merges class names correctly", () => {
      const result = cn("text-red-500", "text-blue-500")
      expect(result).toBe("text-blue-500")
    })

    it("handles conditional classes", () => {
      const isActive = true
      const result = cn("base-class", isActive && "active-class")
      expect(result).toBe("base-class active-class")
    })

    it("filters out falsy values", () => {
      const result = cn("base", false, null, undefined, "end")
      expect(result).toBe("base end")
    })
  })
})

