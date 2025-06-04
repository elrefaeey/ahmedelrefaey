"use client"

import { useState, useEffect } from "react"
import { supabase, type Project } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X, Plus, Edit, Trash2, Save, DeleteIcon as Cancel } from "lucide-react"

interface AdminPanelProps {
  isOpen: boolean
  onClose: () => void
  currentLang: string
}

export default function AdminPanel({ isOpen, onClose, currentLang }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title_en: "",
    title_ar: "",
    description_en: "",
    description_ar: "",
    link: "",
    image_url: "",
    alt_text: "",
    display_order: 0,
  })

  const getText = (enText: string, arText: string) => {
    return currentLang === "ar" ? arText : enText
  }

  useEffect(() => {
    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.from("projects").select("*").order("display_order", { ascending: true })

      if (error) throw error
      setProjects(data || [])
    } catch (error) {
      console.error("Error fetching projects:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title_en: "",
      title_ar: "",
      description_en: "",
      description_ar: "",
      link: "",
      image_url: "",
      alt_text: "",
      display_order: projects.length + 1,
    })
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title_en: project.title_en,
      title_ar: project.title_ar,
      description_en: project.description_en,
      description_ar: project.description_ar,
      link: project.link,
      image_url: project.image_url || "",
      alt_text: project.alt_text || "",
      display_order: project.display_order,
    })
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setIsAddingNew(true)
    setEditingProject(null)
    resetForm()
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      if (isAddingNew) {
        const { error } = await supabase.from("projects").insert([formData])

        if (error) throw error
      } else if (editingProject) {
        const { error } = await supabase.from("projects").update(formData).eq("id", editingProject.id)

        if (error) throw error
      }

      await fetchProjects()
      handleCancel()
    } catch (error) {
      console.error("Error saving project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm(getText("Are you sure you want to delete this project?", "هل أنت متأكد من حذف هذا المشروع؟"))) {
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id)

      if (error) throw error
      await fetchProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingProject(null)
    setIsAddingNew(false)
    resetForm()
  }

  const toggleActive = async (project: Project) => {
    setLoading(true)
    try {
      const { error } = await supabase.from("projects").update({ is_active: !project.is_active }).eq("id", project.id)

      if (error) throw error
      await fetchProjects()
    } catch (error) {
      console.error("Error toggling project status:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {getText("Admin Panel - Project Management", "لوحة الإدارة - إدارة المشاريع")}
          </h2>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose} className="flex items-center gap-2">
              <X className="h-4 w-4" />
              {getText("Close Panel", "إغلاق اللوحة")}
            </Button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <Button onClick={handleAddNew} disabled={loading || isAddingNew}>
              <Plus className="h-4 w-4 mr-2" />
              {getText("Add New Project", "إضافة مشروع جديد")}
            </Button>
          </div>

          {(isAddingNew || editingProject) && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>
                  {isAddingNew
                    ? getText("Add New Project", "إضافة مشروع جديد")
                    : getText("Edit Project", "تعديل المشروع")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {getText("Title (English)", "العنوان (إنجليزي)")}
                    </label>
                    <Input
                      value={formData.title_en}
                      onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                      placeholder="Project title in English"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {getText("Title (Arabic)", "العنوان (عربي)")}
                    </label>
                    <Input
                      value={formData.title_ar}
                      onChange={(e) => setFormData({ ...formData, title_ar: e.target.value })}
                      placeholder="عنوان المشروع بالعربية"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {getText("Description (English)", "الوصف (إنجليزي)")}
                    </label>
                    <Textarea
                      value={formData.description_en}
                      onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                      placeholder="Project description in English"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {getText("Description (Arabic)", "الوصف (عربي)")}
                    </label>
                    <Textarea
                      value={formData.description_ar}
                      onChange={(e) => setFormData({ ...formData, description_ar: e.target.value })}
                      placeholder="وصف المشروع بالعربية"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">{getText("Project Link", "رابط المشروع")}</label>
                    <Input
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{getText("Image URL", "رابط الصورة")}</label>
                    <Input
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">{getText("Display Order", "ترتيب العرض")}</label>
                    <Input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) =>
                        setFormData({ ...formData, display_order: Number.parseInt(e.target.value) || 0 })
                      }
                      placeholder="1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">{getText("Alt Text", "النص البديل")}</label>
                  <Input
                    value={formData.alt_text}
                    onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                    placeholder="Image description for accessibility"
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={loading}>
                    <Save className="h-4 w-4 mr-2" />
                    {getText("Save", "حفظ")}
                  </Button>
                  <Button variant="outline" onClick={handleCancel} disabled={loading}>
                    <Cancel className="h-4 w-4 mr-2" />
                    {getText("Cancel", "إلغاء")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="space-y-4">
            {loading && projects.length === 0 ? (
              <div className="text-center py-8">{getText("Loading projects...", "جاري تحميل المشاريع...")}</div>
            ) : (
              projects.map((project) => (
                <Card key={project.id} className={`${!project.is_active ? "opacity-50" : ""}`}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {currentLang === "ar" ? project.title_ar : project.title_en}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {currentLang === "ar" ? project.description_ar : project.description_en}
                        </p>
                        <div className="mt-2 text-sm text-gray-500">
                          <span className="mr-4">
                            {getText("Order:", "الترتيب:")} {project.display_order}
                          </span>
                          <span className="mr-4">
                            {getText("Status:", "الحالة:")}{" "}
                            {project.is_active ? getText("Active", "نشط") : getText("Inactive", "غير نشط")}
                          </span>
                          <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {getText("View Live", "عرض مباشر")}
                          </a>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => toggleActive(project)} disabled={loading}>
                          {project.is_active ? getText("Deactivate", "إلغاء تفعيل") : getText("Activate", "تفعيل")}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)} disabled={loading}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(project.id)}
                          disabled={loading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
