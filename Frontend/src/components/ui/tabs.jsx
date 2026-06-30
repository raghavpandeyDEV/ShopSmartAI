import React, { createContext, useContext, useState } from "react"

const TabsContext = createContext()

export const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabsContext.Provider>
  )
}

export const TabsList = ({ children, className }) => {
  return <div className={className}>{children}</div>
}

export const TabsTrigger = ({ value, children, className }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext)

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`${className} ${
        activeTab === value
          ? "bg-pink-500 text-white"
          : "bg-gray-200 text-black"
      } px-4 py-2 rounded`}
    >
      {children}
    </button>
  )
}

export const TabsContent = ({ value, children }) => {
  const { activeTab } = useContext(TabsContext)

  if (activeTab !== value) return null
  return <div>{children}</div>
}