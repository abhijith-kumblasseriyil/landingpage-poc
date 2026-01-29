import { useBuilder } from '../context/BuilderContext'
import './TemplateDetailsTab.css'

function TemplateDetailsTab() {
  const {
    name,
    templateId,
    templateType,
    maxSteps,
    maxPages,
    formName,
    formId,
    logoUrl,
    logoAlt,
    setTemplateDetails
  } = useBuilder()

  return (
    <div className="template-details-tab">
      <h2 className="template-details-title">Template details</h2>
      <div className="template-details-form">
        <div className="form-row">
          <label>Template name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setTemplateDetails({ name: e.target.value })}
            placeholder="e.g. Contact form"
          />
        </div>
        <div className="form-row">
          <label>Template ID</label>
          <input
            type="text"
            value={templateId}
            onChange={(e) => setTemplateDetails({ templateId: e.target.value })}
            placeholder="e.g. step-form"
          />
        </div>
        <div className="form-row">
          <label>Form name</label>
          <input
            type="text"
            value={formName ?? ''}
            onChange={(e) => setTemplateDetails({ formName: e.target.value })}
            placeholder="e.g. landing-form"
          />
        </div>
        <div className="form-row">
          <label>Form ID</label>
          <input
            type="text"
            value={formId ?? ''}
            onChange={(e) => setTemplateDetails({ formId: e.target.value })}
            placeholder="e.g. landing-form-id"
          />
        </div>
        <div className="form-row">
          <label>Template logo URL</label>
          <input
            type="url"
            value={logoUrl ?? ''}
            onChange={(e) => setTemplateDetails({ logoUrl: e.target.value })}
            placeholder="https://example.com/logo.png"
          />
        </div>
        <div className="form-row">
          <label>Logo alt text</label>
          <input
            type="text"
            value={logoAlt ?? 'Logo'}
            onChange={(e) => setTemplateDetails({ logoAlt: e.target.value })}
            placeholder="e.g. Company logo"
          />
        </div>
        <div className="form-row">
          <label>Template type</label>
          <select
            value={templateType}
            onChange={(e) => setTemplateDetails({ templateType: e.target.value })}
          >
            <option value="step-by-step">Step-by-step</option>
            <option value="multi-page">Multi-page</option>
          </select>
        </div>
        {templateType === 'step-by-step' && (
          <div className="form-row">
            <label>Max steps</label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxSteps}
              onChange={(e) => setTemplateDetails({ maxSteps: parseInt(e.target.value, 10) || 5 })}
            />
          </div>
        )}
        {templateType === 'multi-page' && (
          <div className="form-row">
            <label>Max pages</label>
            <input
              type="number"
              min={1}
              max={20}
              value={maxPages}
              onChange={(e) => setTemplateDetails({ maxPages: parseInt(e.target.value, 10) || 10 })}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateDetailsTab
