# Contributing to SakshamAI Rural

Thank you for your interest in contributing to SakshamAI Rural! This project aims to empower differently abled individuals in rural India through accessible AI technology.

## Code of Conduct

- Be respectful and inclusive
- Focus on accessibility and user needs
- Prioritize rural India's context
- Keep costs low (≤₹5 per user per month)

## How to Contribute

### 1. Fork the Repository

Click the "Fork" button at the top right of the repository page.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR_USERNAME/sakshamai-rural.git
cd sakshamai-rural
```

### 3. Create a Branch

```bash
git checkout -b feature/your-feature-name
```

Branch naming conventions:
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `docs/documentation-update` - Documentation
- `refactor/component-name` - Code refactoring

### 4. Make Your Changes

Follow the coding standards below.

### 5. Test Your Changes

```bash
# Frontend tests
cd frontend
npm test

# Build test
npm run build
```

### 6. Commit Your Changes

```bash
git add .
git commit -m "Brief description of changes"
```

Commit message format:
- `feat: Add new feature`
- `fix: Fix bug in component`
- `docs: Update documentation`
- `refactor: Refactor code`
- `test: Add tests`
- `chore: Update dependencies`

### 7. Push to Your Fork

```bash
git push origin feature/your-feature-name
```

### 8. Create Pull Request

1. Go to your fork on GitHub
2. Click "Compare & pull request"
3. Fill out the PR template
4. Submit the PR

## Coding Standards

### Frontend (React)

- Use functional components with hooks
- Follow React best practices
- Use Tailwind CSS for styling
- Ensure WCAG 2.1 Level AA compliance
- Add proper ARIA labels
- Minimum 44x44px touch targets
- Support keyboard navigation

### Backend (Python)

- Follow PEP 8 style guide
- Use type hints where appropriate
- Add docstrings to functions
- Handle errors gracefully
- Log important events
- Keep Lambda functions under 10MB

### Accessibility Requirements

All contributions MUST:
- Work with screen readers
- Support keyboard navigation
- Have proper ARIA labels
- Meet WCAG 2.1 AA color contrast
- Have minimum 44x44px touch targets
- Support Hindi and English

### Testing Requirements

- Add tests for new features
- Ensure existing tests pass
- Test on mobile devices
- Test with screen readers
- Test in both Hindi and English

## Project Structure

```
sakshamai-rural/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   └── services/     # API services
│   └── package.json
├── backend/              # Lambda functions
│   ├── currency_detector/
│   ├── prescription_reader/
│   ├── text_to_speech/
│   └── vision_orchestrator/
└── .github/              # CI/CD workflows
```

## Development Workflow

1. Pick an issue or create one
2. Discuss approach in issue comments
3. Create feature branch
4. Make changes
5. Write tests
6. Submit PR
7. Address review comments
8. Merge after approval

## What to Contribute

### High Priority
- Accessibility improvements
- Performance optimizations
- Cost reduction strategies
- Hindi language improvements
- Mobile responsiveness
- Bug fixes

### Medium Priority
- New features (with cost analysis)
- Additional Indian languages
- UI/UX enhancements
- Documentation improvements

### Low Priority
- Code refactoring
- Dependency updates
- Developer tooling

## AWS Cost Guidelines

When adding features:
1. Estimate cost per user per month
2. Keep total cost ≤₹5 per user
3. Use serverless architecture
4. Implement caching where possible
5. Add lifecycle policies for data

## Questions?

- Open an issue for questions
- Check existing documentation
- Review closed PRs for examples

## Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes
- Project documentation

Thank you for helping make technology accessible to rural India!
