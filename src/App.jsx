import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { supabase, supabaseConfigured } from './lib/supabase'

const presetProjectIcons = ['fa-code', 'fa-laptop-code', 'fa-rocket', 'fa-server', 'fa-mobile-alt']
const presetCertificateIcons = ['fa-certificate', 'fa-award', 'fa-medal', 'fa-graduation-cap']
const loginLogo = import.meta.env.VITE_ADMIN_LOGO_URL || '/logo.png'
const certificateBucket = import.meta.env.VITE_CERTIFICATE_BUCKET || 'certificates'

const emptyProject = {
  id: '',
  title: '',
  description: '',
  image: '',
  tags: '',
  demo: '',
  icon: 'fa-code',
  github: '',
  published: true,
}

const emptyCertification = {
  id: '',
  title: '',
  issuer: '',
  issued_at: '',
  description: '',
  skills: '',
  certificate_path: '',
  icon: 'fa-certificate',
}

function splitList(value) {
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

function joinList(items) {
  return (items || []).join(', ')
}

function formatError(error) {
  return error?.message || 'Something went wrong. Please try again.'
}

function createProjectPayload(form) {
  return {
    id: form.id.trim(),
    title: form.title.trim(),
    description: form.description.trim(),
    image: form.image.trim(),
    tags: splitList(form.tags),
    demo: form.demo.trim(),
    icon: form.icon.trim() || 'fa-code',
    github: form.github.trim(),
    published: !!form.published,
  }
}

function createCertificationPayload(form) {
  return {
    id: form.id.trim(),
    title: form.title.trim(),
    issuer: form.issuer.trim(),
    issued_at: form.issued_at.trim(),
    description: form.description.trim(),
    skills: splitList(form.skills),
    certificate_path: form.certificate_path.trim(),
    icon: form.icon.trim() || 'fa-certificate',
  }
}

function ProjectForm({ form, onChange, onSubmit, onCancel, submitting, editing }) {
  return (
    <form className="editor-card" onSubmit={onSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Projects</p>
          <h2>{editing ? 'Edit Project' : 'Add Project'}</h2>
        </div>
        {editing ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="form-grid">
        <label>
          <span>ID</span>
          <input
            name="id"
            value={form.id}
            onChange={onChange}
            placeholder="smart-irrigation-system"
            required
            disabled={editing}
          />
        </label>

        <label>
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="Smart Irrigation System"
            required
          />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Short summary of the project"
            rows="4"
            required
          />
        </label>

        <label className="full-width">
          <span>Image URL</span>
          <input
            name="image"
            type="url"
            value={form.image}
            onChange={onChange}
            placeholder="https://..."
            required
          />
        </label>

        <label className="full-width">
          <span>Tags</span>
          <input
            name="tags"
            value={form.tags}
            onChange={onChange}
            placeholder="Arduino, IoT, Python, Sensors"
            required
          />
        </label>

        <label>
          <span>Live Demo URL</span>
          <input
            name="demo"
            type="url"
            value={form.demo}
            onChange={onChange}
            placeholder="https://your-demo.com"
            required
          />
        </label>

        <label>
          <span>GitHub URL</span>
          <input
            name="github"
            type="url"
            value={form.github}
            onChange={onChange}
            placeholder="https://github.com/..."
          />
        </label>

        <label>
          <span>Icon</span>
          <input name="icon" value={form.icon} onChange={onChange} list="project-icons" placeholder="fa-seedling" required />
          <datalist id="project-icons">
            {presetProjectIcons.map((icon) => (
              <option key={icon} value={icon} />
            ))}
          </datalist>
        </label>

        <label className="checkbox-row">
          <input
            name="published"
            type="checkbox"
            checked={form.published}
            onChange={onChange}
          />
          <span>Published on public portfolio</span>
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={submitting}>
        {submitting ? 'Saving...' : editing ? 'Update Project' : 'Create Project'}
      </button>
    </form>
  )
}

function CertificationForm({
  form,
  onChange,
  onSubmit,
  onCancel,
  onFileSelect,
  uploadingFile,
  selectedFileName,
  submitting,
  editing,
}) {
  return (
    <form className="editor-card" onSubmit={onSubmit}>
      <div className="section-heading">
        <div>
          <p className="eyebrow">Certificates</p>
          <h2>{editing ? 'Edit Certificate' : 'Add Certificate'}</h2>
        </div>
        {editing ? (
          <button type="button" className="ghost-button" onClick={onCancel}>
            Cancel edit
          </button>
        ) : null}
      </div>

      <div className="form-grid">
        <label>
          <span>ID</span>
          <input
            name="id"
            value={form.id}
            onChange={onChange}
            placeholder="html-css-edx"
            required
            disabled={editing}
          />
        </label>

        <label>
          <span>Title</span>
          <input
            name="title"
            value={form.title}
            onChange={onChange}
            placeholder="HTML & CSS Certificate"
            required
          />
        </label>

        <label>
          <span>Issuer</span>
          <input
            name="issuer"
            value={form.issuer}
            onChange={onChange}
            placeholder="WSCX/EDX"
            required
          />
        </label>

        <label>
          <span>Issued Date</span>
          <input
            name="issued_at"
            type="date"
            value={form.issued_at}
            onChange={onChange}
            required
          />
        </label>

        <label className="full-width">
          <span>Description</span>
          <textarea
            name="description"
            value={form.description}
            onChange={onChange}
            placeholder="Short summary of the certificate"
            rows="4"
            required
          />
        </label>

        <label className="full-width">
          <span>Skills</span>
          <input
            name="skills"
            value={form.skills}
            onChange={onChange}
            placeholder="HTML, CSS"
            required
          />
        </label>

        <label className="full-width">
          <span>Upload Certificate Image</span>
          <input name="certificate_image_file" type="file" accept="image/*" onChange={onFileSelect} />
          <small className="muted">
            {uploadingFile ? 'Uploading image to Supabase storage...' : `Uploads to bucket: ${certificateBucket}`}
          </small>
          {selectedFileName ? <small className="muted">Selected: {selectedFileName}</small> : null}
          {form.certificate_path ? (
            <small className="muted">Uploaded file ready. It will be used for “View Certificate”.</small>
          ) : (
            <small className="muted">Please upload a certificate image before saving.</small>
          )}
        </label>

        <label>
          <span>Icon</span>
          <input name="icon" value={form.icon} onChange={onChange} list="certificate-icons" placeholder="fa-certificate" required />
          <datalist id="certificate-icons">
            {presetCertificateIcons.map((icon) => (
              <option key={icon} value={icon} />
            ))}
          </datalist>
        </label>
      </div>

      <button className="primary-button" type="submit" disabled={submitting || uploadingFile}>
        {submitting ? 'Saving...' : editing ? 'Update Certificate' : 'Create Certificate'}
      </button>
    </form>
  )
}

function ItemList({ items, type, onEdit, onDelete, busyId }) {
  if (!items.length) {
    return (
      <div className="empty-state">
        <p>No {type} yet.</p>
      </div>
    )
  }

  return (
    <div className="item-list">
      {items.map((item) => (
        <article className="list-card" key={item.id}>
          <div className="list-card__content">
            <div className="list-card__title-row">
              <div>
                <h3>{item.title}</h3>
                <p className="muted">
                  {type === 'projects' ? item.id : `${item.issuer} • ${item.issued_at}`}
                </p>
              </div>
              <span className="pill">{item.icon}</span>
            </div>
            <p className="list-card__description">{item.description}</p>
            <div className="chip-row">
              {(type === 'projects' ? item.tags : item.skills).map((entry) => (
                <span className="chip" key={entry}>
                  {entry}
                </span>
              ))}
            </div>
            {type === 'projects' ? (
              <div className="meta-row">
                <span>{item.published ? 'Published' : 'Hidden'}</span>
                <span>{item.demo}</span>
              </div>
            ) : (
              <div className="meta-row">
                <span>{item.id}</span>
                <span>{item.certificate_path || item.image}</span>
              </div>
            )}
          </div>
          <div className="list-card__actions">
            <button className="ghost-button" type="button" onClick={() => onEdit(item)}>
              Edit
            </button>
            <button
              className="danger-button"
              type="button"
              disabled={busyId === item.id}
              onClick={() => onDelete(item)}
            >
              {busyId === item.id ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </article>
      ))}
    </div>
  )
}

function App() {
  const [session, setSession] = useState(null)
  const [loadingSession, setLoadingSession] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loggingIn, setLoggingIn] = useState(false)
  const [status, setStatus] = useState({ tone: '', text: '' })
  const [activeTab, setActiveTab] = useState('projects')
  const [projects, setProjects] = useState([])
  const [certifications, setCertifications] = useState([])
  const [loadingData, setLoadingData] = useState(false)
  const [projectForm, setProjectForm] = useState(emptyProject)
  const [certificationForm, setCertificationForm] = useState(emptyCertification)
  const [editingProjectId, setEditingProjectId] = useState('')
  const [editingCertificationId, setEditingCertificationId] = useState('')
  const [savingProject, setSavingProject] = useState(false)
  const [savingCertification, setSavingCertification] = useState(false)
  const [uploadingCertificateImage, setUploadingCertificateImage] = useState(false)
  const [selectedCertificateFile, setSelectedCertificateFile] = useState(null)
  const [deletingId, setDeletingId] = useState('')

  const dashboardStats = useMemo(
    () => [
      { label: 'Projects', value: projects.length },
      { label: 'Published Projects', value: projects.filter((item) => item.published).length },
      { label: 'Certificates', value: certifications.length },
      { label: 'Unique Issuers', value: new Set(certifications.map((item) => item.issuer)).size },
    ],
    [projects, certifications],
  )

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoadingSession(false)
      return
    }

    let isMounted = true

    supabase.auth.getSession().then(({ data, error }) => {
      if (!isMounted) {
        return
      }

      if (error) {
        setStatus({ tone: 'error', text: formatError(error) })
      } else {
        setSession(data.session ?? null)
      }

      setLoadingSession(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setLoadingSession(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!session || !supabaseConfigured) {
      return
    }

    loadDashboardData()
  }, [session])

  async function loadDashboardData() {
    setLoadingData(true)
    setStatus({ tone: '', text: '' })

    const [projectsResult, certificationsResult] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('certifications').select('*').order('created_at', { ascending: false }),
    ])

    if (projectsResult.error) {
      setStatus({ tone: 'error', text: formatError(projectsResult.error) })
      setLoadingData(false)
      return
    }

    if (certificationsResult.error) {
      setStatus({ tone: 'error', text: formatError(certificationsResult.error) })
      setLoadingData(false)
      return
    }

    setProjects(projectsResult.data || [])
    setCertifications(certificationsResult.data || [])
    setLoadingData(false)
  }

  async function handleLogin(event) {
    event.preventDefault()
    setLoggingIn(true)
    setStatus({ tone: '', text: '' })

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
    } else {
      setStatus({ tone: 'success', text: 'Logged in successfully.' })
      setPassword('')
    }

    setLoggingIn(false)
  }

  async function handleLogout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
      return
    }

    setProjects([])
    setCertifications([])
    setProjectForm(emptyProject)
    setCertificationForm(emptyCertification)
    setEditingProjectId('')
    setEditingCertificationId('')
    setStatus({ tone: 'success', text: 'Logged out.' })
  }

  async function handleProjectSubmit(event) {
    event.preventDefault()
    setSavingProject(true)
    setStatus({ tone: '', text: '' })

    const payload = createProjectPayload(projectForm)
    const query = editingProjectId
      ? supabase.from('projects').update(payload).eq('id', editingProjectId)
      : supabase.from('projects').insert(payload)

    const { error } = await query

    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
      setSavingProject(false)
      return
    }

    setProjectForm(emptyProject)
    setEditingProjectId('')
    setStatus({
      tone: 'success',
      text: editingProjectId ? 'Project updated.' : 'Project created.',
    })
    setSavingProject(false)
    loadDashboardData()
  }

  async function handleCertificationSubmit(event) {
    event.preventDefault()
    setSavingCertification(true)
    setStatus({ tone: '', text: '' })
    let certificatePath = certificationForm.certificate_path.trim()
    if (!certificatePath && selectedCertificateFile) {
      certificatePath = await uploadCertificateFile(selectedCertificateFile)
      if (!certificatePath) {
        setSavingCertification(false)
        return
      }
      setCertificationForm((current) => ({ ...current, certificate_path: certificatePath }))
    }
    if (!certificatePath) {
      setStatus({ tone: 'error', text: 'Please upload a certificate image before saving.' })
      setSavingCertification(false)
      return
    }

    const payload = createCertificationPayload({ ...certificationForm, certificate_path: certificatePath })
    const query = editingCertificationId
      ? supabase.from('certifications').update(payload).eq('id', editingCertificationId)
      : supabase.from('certifications').insert(payload)

    const { error } = await query

    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
      setSavingCertification(false)
      return
    }

    setCertificationForm(emptyCertification)
    setSelectedCertificateFile(null)
    setEditingCertificationId('')
    setStatus({
      tone: 'success',
      text: editingCertificationId ? 'Certificate updated.' : 'Certificate created.',
    })
    setSavingCertification(false)
    loadDashboardData()
  }

  async function handleDeleteProject(project) {
    if (!window.confirm(`Delete project "${project.title}"?`)) {
      return
    }

    setDeletingId(project.id)
    const { error } = await supabase.from('projects').delete().eq('id', project.id)

    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
    } else {
      setStatus({ tone: 'success', text: 'Project deleted.' })
      if (editingProjectId === project.id) {
        setEditingProjectId('')
        setProjectForm(emptyProject)
      }
      loadDashboardData()
    }

    setDeletingId('')
  }

  async function handleDeleteCertification(certification) {
    if (!window.confirm(`Delete certificate "${certification.title}"?`)) {
      return
    }

    setDeletingId(certification.id)
    const { error } = await supabase.from('certifications').delete().eq('id', certification.id)

    if (error) {
      setStatus({ tone: 'error', text: formatError(error) })
    } else {
      setStatus({ tone: 'success', text: 'Certificate deleted.' })
      if (editingCertificationId === certification.id) {
        setEditingCertificationId('')
        setCertificationForm(emptyCertification)
      }
      loadDashboardData()
    }

    setDeletingId('')
  }

  function beginProjectEdit(project) {
    setActiveTab('projects')
    setEditingProjectId(project.id)
    setProjectForm({
      id: project.id,
      title: project.title,
      description: project.description,
      image: project.image,
      tags: joinList(project.tags),
      demo: project.demo,
      icon: project.icon,
      github: project.github || '',
      published: project.published,
    })
  }

  function beginCertificationEdit(certification) {
    setActiveTab('certifications')
    setEditingCertificationId(certification.id)
    setCertificationForm({
      id: certification.id,
      title: certification.title,
      issuer: certification.issuer,
      issued_at: certification.issued_at,
      description: certification.description,
      skills: joinList(certification.skills),
      certificate_path: certification.certificate_path || certification.image || '',
      icon: certification.icon,
    })
    setSelectedCertificateFile(null)
  }

  function handleProjectChange(event) {
    const { name, value, type, checked } = event.target
    setProjectForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  function handleCertificationChange(event) {
    const { name, value } = event.target
    setCertificationForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  function handleCertificateFileSelect(event) {
    const file = event.target.files?.[0]
    if (!file) {
      setSelectedCertificateFile(null)
      return
    }
    setSelectedCertificateFile(file)
    setStatus({ tone: '', text: '' })
  }

  async function uploadCertificateFile(file) {
    setUploadingCertificateImage(true)
    setStatus({ tone: '', text: '' })
    const extension = file.name.includes('.') ? file.name.split('.').pop() : 'png'
    const filePath = `certificates/${Date.now()}-${Math.random().toString(36).slice(2)}.${extension}`
    const { data: uploadData, error: uploadError } = await supabase.storage.from(certificateBucket).upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })
    if (uploadError) {
      setStatus({ tone: 'error', text: formatError(uploadError) })
      setUploadingCertificateImage(false)
      return ''
    }
    const { data } = supabase.storage.from(certificateBucket).getPublicUrl(uploadData?.path || filePath)
    if (!data?.publicUrl) {
      setStatus({ tone: 'error', text: 'Upload succeeded but URL generation failed. Please check bucket settings.' })
      setUploadingCertificateImage(false)
      return ''
    }
    setStatus({ tone: 'success', text: 'Certificate image uploaded.' })
    setUploadingCertificateImage(false)
    return data.publicUrl
  }

  if (!supabaseConfigured) {
    return (
      <main className="setup-screen">
        <div className="setup-card">
          <p className="eyebrow">Admin Portal</p>
          <h1>Supabase config needed</h1>
          <p>
            Add <code>VITE_SUPABASE_URL</code> and <code>VITE_SUPABASE_ANON_KEY</code> to
            your admin app environment before running this portal.
          </p>
          <p className="muted">
            Use the same publishable key and project URL as your public portfolio.
          </p>
          <p className="muted">
            For certificate uploads, create a public Supabase Storage bucket named{' '}
            <code>{certificateBucket}</code>.
          </p>
        </div>
      </main>
    )
  }

  if (loadingSession) {
    return (
      <main className="setup-screen">
        <div className="setup-card">
          <p className="eyebrow">Admin Portal</p>
          <h1>Checking your session...</h1>
        </div>
      </main>
    )
  }

  if (!session) {
    return (
      <main className="auth-shell">
        <section className="auth-copy">
          <p className="eyebrow">Private workspace</p>
          <img
            className="auth-logo"
            src={loginLogo}
            alt="Admin logo"
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
          <h1>Portfolio control room</h1>
          <p>
            Sign in with your Supabase account to manage projects and certificates from
            anywhere.
          </p>
          <div className="feature-stack">
            <div className="feature-card">
              <h2>Projects</h2>
              <p>Publish live demos, GitHub links, tags, icons, and project cover images.</p>
            </div>
            <div className="feature-card">
              <h2>Certificates</h2>
              <p>Manage issuers, dates, skill tags, and certificate preview images.</p>
            </div>
          </div>
        </section>

        <form className="auth-card" onSubmit={handleLogin}>
          <p className="eyebrow">Sign in</p>
          <h2>Welcome back</h2>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
              required
            />
          </label>

          {status.text ? <p className={`status ${status.tone}`}>{status.text}</p> : null}

          <button className="primary-button" type="submit" disabled={loggingIn}>
            {loggingIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className="dashboard-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Separate admin portal</p>
          <h1>Portfolio Admin</h1>
        </div>
        <div className="topbar__actions">
          <div className="session-badge">{session.user.email}</div>
          <button className="ghost-button" type="button" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </header>

      {status.text ? <p className={`status ${status.tone}`}>{status.text}</p> : null}

      <section className="stats-grid">
        {dashboardStats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </article>
        ))}
      </section>

      <section className="tabs">
        <button
          className={activeTab === 'projects' ? 'tab active' : 'tab'}
          type="button"
          onClick={() => setActiveTab('projects')}
        >
          Projects
        </button>
        <button
          className={activeTab === 'certifications' ? 'tab active' : 'tab'}
          type="button"
          onClick={() => setActiveTab('certifications')}
        >
          Certificates
        </button>
        <button className="ghost-button" type="button" onClick={loadDashboardData}>
          {loadingData ? 'Refreshing...' : 'Refresh data'}
        </button>
      </section>

      {activeTab === 'projects' ? (
        <section className="workspace-grid">
          <ProjectForm
            form={projectForm}
            onChange={handleProjectChange}
            onSubmit={handleProjectSubmit}
            onCancel={() => {
              setEditingProjectId('')
              setProjectForm(emptyProject)
            }}
            submitting={savingProject}
            editing={!!editingProjectId}
          />
          <div className="list-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Current content</p>
                <h2>All Projects</h2>
              </div>
            </div>
            <ItemList
              items={projects}
              type="projects"
              onEdit={beginProjectEdit}
              onDelete={handleDeleteProject}
              busyId={deletingId}
            />
          </div>
        </section>
      ) : (
        <section className="workspace-grid">
          <CertificationForm
            form={certificationForm}
            onChange={handleCertificationChange}
            onFileSelect={handleCertificateFileSelect}
            uploadingFile={uploadingCertificateImage}
            selectedFileName={selectedCertificateFile?.name || ''}
            onSubmit={handleCertificationSubmit}
            onCancel={() => {
              setEditingCertificationId('')
              setCertificationForm(emptyCertification)
              setSelectedCertificateFile(null)
            }}
            submitting={savingCertification}
            editing={!!editingCertificationId}
          />
          <div className="list-panel">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Current content</p>
                <h2>All Certificates</h2>
              </div>
            </div>
            <ItemList
              items={certifications}
              type="certifications"
              onEdit={beginCertificationEdit}
              onDelete={handleDeleteCertification}
              busyId={deletingId}
            />
          </div>
        </section>
      )}
    </main>
  )
}

export default App
