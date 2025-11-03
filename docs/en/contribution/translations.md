# Translations

To make Tachybase accessible to users worldwide, we welcome community members to participate in translating documentation into different languages. This guide provides detailed instructions on how to contribute translations.

## Currently Supported Languages

- English (en): Primary documentation language
- Chinese (zh): Simplified Chinese translation

## Repository Structure

The Tachybase project contains two important repositories:

- **Documentation Repository**: [tachybase/tachybase-doc](https://github.com/tachybase/tachybase-doc) - Used to manage and maintain all documentation content
- **Code Repository**: [tachybase/tachybase](https://github.com/tachybase/tachybase) - Main project code repository

Translation work can be done in two ways:

1. **Contributing to the Documentation Repository**: This is the recommended approach, suitable for most translation work. Documentation changes will be periodically synced to the main code repository.
2. **Contributing to the Main Code Repository**: If you're contributing code and also want to update related documentation, you can do translation work directly in the main tachybase repository.

Choose the appropriate method based on your specific situation and contribution content. The following instructions will cover both contribution methods.

## Getting Started with Translation

### Prerequisites

Before starting translation, ensure you have:

1. A GitHub account
2. Basic understanding of Markdown syntax
3. Familiarity with Git workflow (fork, clone, commit, push, pull request)
4. Fluency in both English and the target language

### Translation Workflow - Documentation Repository Method

1. **Fork and Clone**: Fork the [Tachybase Documentation Repository](https://github.com/tachybase/tachybase-doc) and clone it to your local machine.

2. **Create Branch**: Create a new branch for your translation work.
   ```bash
   git checkout -b translation-[language-code]
   ```

3. **Directory Structure**: Translation content is organized in language-specific directories under `docs/`:
   - English documentation is located in `docs/en/`
   - Chinese documentation is located in `docs/zh/`
   - If other languages are needed, create the corresponding language directory (e.g., `docs/ja/` for Japanese)

4. **File Structure**: Maintain the same file structure as the English documentation. For example, if you're translating `docs/en/guides/introduction.md`, you should create `docs/[language-code]/guides/introduction.md`.

5. **Metadata**: Ensure `_meta.json` files are also translated for proper navigation.

### Translation Workflow - Main Code Repository Method

1. **Fork and Clone**: Fork the [Tachybase Main Code Repository](https://github.com/tachybase/tachybase) and clone it to your local machine.

2. **Create Branch**: Create a new branch for your translation work.
   ```bash
   git checkout -b docs-translation-[language-code]
   ```

4. **Perform Translation**: Follow the same file organization principles as the documentation repository for translation work.

## Translation Guidelines

### Basic Principles

1. **Maintain Technical Accuracy**: Ensure technical terms and concepts are accurately translated.
2. **Cultural Considerations**: Adjust examples and explanations when necessary to make them culturally appropriate.
3. **Consistency**: Use consistent terminology throughout the translation.
4. **Preserve Original Format**: Retain Markdown formatting, code blocks, links, and other structural elements.

### Specific Guidelines

1. **Code Examples**: Do not translate code examples unless the code contains comments. Only translate the comment portions.
   ```javascript
   // This comment should be translated
   const example = 'Do not translate this string';
   ```

2. **Technical Terms**: If certain technical terms are commonly used in English in your language, consider keeping them in English, but provide a translation in parentheses on first appearance.

3. **Links**: Update internal links to point to translated versions of pages (if available). For links pointing to code repositories, ensure they point to the correct location.

4. **Screenshots**: If screenshots contain text, consider creating a version with text in your language.

## Submitting Your Translation

### Submitting to Documentation Repository

1. **Commit Changes**: Commit your changes with a descriptive message.
   ```bash
   git commit -m "Add [language] translation: [specific content]"
   ```

2. **Push and Create Pull Request**: Push changes to your fork and create a Pull Request to the Tachybase documentation repository.
   ```bash
   git push origin translation-[language-code]
   ```
   Then create a Pull Request on GitHub from your fork to the `tachybase/tachybase-doc` main branch.

### Submitting to Main Code Repository

1. **Commit Changes**: Commit your changes with a descriptive message.
   ```bash
   git commit -m "docs: Add [language] translation: [specific content]"
   ```

2. **Push and Create Pull Request**: Push changes to your fork and create a Pull Request to the Tachybase main code repository.
   ```bash
   git push origin docs-translation-[language-code]
   ```
   Then create a Pull Request on GitHub from your fork to the `tachybase/tachybase` main branch.

3. **Review Process**: Your translation will be reviewed by project maintainers and possibly other speakers of the language. Be prepared to make revisions based on feedback.

## Maintaining Translations

Documentation evolves over time. To keep translations up-to-date:

1. **Watch Relevant Repository**: Based on your contribution method, watch the documentation repository or main code repository to receive notifications of changes to English documentation.
2. **Regular Updates**: Periodically check if the English version has been updated and update your translation accordingly.
3. **Sync Upstream Changes**: Before starting new translation work, ensure your fork is synced with the upstream repository.

## Synchronization Between Repositories

Please note:

- Content from the documentation repository is periodically synced to the main code repository
- Documentation improvements from the main code repository are also synced to the documentation repository
- If you're unsure which repository to contribute to, choose the documentation repository, which is usually the preferred method for handling pure documentation translations

## Translation Status

We maintain a list of documentation that needs translation or updating. Check issues labeled "translation" in both repositories to find documentation that needs attention.

## Cross-Repository Collaboration

Sometimes documentation needs to reference content from the code repository. If you need to:

1. **Reference Code Examples**: Please reference code from stable branches and clearly indicate that the code comes from the main repository.
2. **New Feature Documentation**: For documentation on unreleased new features, coordinate with developers in the main repository.

## Questions or Need Help?

If you have questions about the translation process, feel free to:
- Open an issue on GitHub in the documentation repository or main code repository with the "translation" label
- Contact documentation maintainers or project maintainers

Thank you for helping make Tachybase accessible to users worldwide!
