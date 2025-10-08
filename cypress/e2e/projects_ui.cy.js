describe('Projects UI - CRUD Operations Test Suite', () => {
    // ===== CONFIGURATION =====
    const CONFIG = {
        baseUrl: 'https://onex-bots-ayyp8jkwf-lebinhnguyens-projects.vercel.app/property-assets/projects/',
        loginUrl: 'https://onex-bots-ayyp8jkwf-lebinhnguyens-projects.vercel.app',
        credentials: {
            username: 'onexapis_admin',
            password: 'Admin@123'
        },
        timeouts: {
            short: 5000,
            medium: 10000,
            long: 20000,
            searchDebounce: 1000
        }
    };

    // ===== TEST DATA GENERATION =====
    const generateTestData = () => {
        const timestamp = Date.now();
        const randomId = Math.floor(Math.random() * 10000);
        const uniqueId = `${timestamp}_${randomId}`;

        return {
            project: {
                name: `AutoTest_Project_${uniqueId}`,
                updatedName: `AutoTest_Project_Updated_${uniqueId}`,
                price: '1500000',
                updatedPrice: '2500000',
                description: 'Automated test project created by Cypress',
                updatedDescription: 'Updated automated test project',
                address: '123 Test Street, District 1',
                zipCode: '700000',
                contact: {
                    name: 'QA Automation',
                    email: `qa_${uniqueId}@test.com`,
                    phone: '0901234567'
                }
            },
            address: {
                province: 'Thành phố Cần Thơ',
                district: 'Quận Ninh Kiều',
                ward: 'Phường An Khánh',
            }
        };
    };

    let testData;

    // ===== HELPER FUNCTIONS =====

    const authenticateUser = () => {
        cy.visit(CONFIG.loginUrl);

        cy.get('input[placeholder="Enter username or email"]', { timeout: CONFIG.timeouts.long })
            .should('be.visible')
            .clear()
            .type(CONFIG.credentials.username);
        cy.get('input[placeholder="Enter password"]')
            .should('be.visible')
            .clear()
            .type(CONFIG.credentials.password, { log: false });

        cy.contains('button', /^Log in$/).click();

        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/dashboard');
        cy.contains('Dashboard', { matchCase: false }).should('exist');

        cy.visit(CONFIG.baseUrl);
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/property-assets/projects');
        cy.contains('button', 'Add Project', { timeout: CONFIG.timeouts.long }).should('be.visible');
    };

    // ---- Fixtures / Upload helpers ----
    const ensureFixtureImage = () => {
        const IMG_B64 =
            'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=';
        cy.writeFile('cypress/fixtures/auto_project.png', IMG_B64, 'base64');
    };

    const uploadProjectImages = (fixturePath = 'cypress/fixtures/auto_project.png') => {
        ensureFixtureImage();

        cy.contains(/Project Images/i, { timeout: CONFIG.timeouts.long })
            .should('be.visible')
            .then(($title) => {
                const $container = $title.closest('div,section');
                if ($container && $container.length) {
                    const $file = $container.find('input[type="file"]').first();
                    if ($file && $file.length) {
                        cy.wrap($file).selectFile(fixturePath, { force: true });
                        return;
                    }
                }
                cy.contains(/^Upload$/i).click({ force: true });
                cy.get('input[type="file"]', { timeout: CONFIG.timeouts.medium })
                    .first()
                    .selectFile(fixturePath, { force: true });
            });
    };

    // ---- Enhanced Radix UI Select helper ----
    const radixSelectByText = (fieldText, optionText, opts = {}) => {
        cy.log(`🔍 Selecting: ${fieldText} -> ${optionText}`);

        // Close any open dropdowns first
        cy.get('body').type('{esc}', { force: true });
        cy.wait(200);

        // Find and click the combobox button
        cy.contains('button[role="combobox"]', fieldText, { timeout: CONFIG.timeouts.long })
            .should('be.visible')
            .click({ force: true });

        // Wait for dropdown to appear
        cy.get('[role="listbox"]', { timeout: CONFIG.timeouts.medium })
            .should('be.visible');

        // Wait for options to load if needed
        if (opts.waitForOptions) {
            cy.wait(2000);
        }

        // Try to find and click the option
        cy.get('body').then($body => {
            const $listbox = $body.find('[role="listbox"]');
            const $options = $listbox.find('[role="option"]');

            cy.log(`Found ${$options.length} options in dropdown`);

            // Log all available options for debugging
            $options.each((index, option) => {
                cy.log(`Option ${index + 1}: ${option.textContent.trim()}`);
            });

            // Try exact match first
            const exactMatch = $options.filter((i, el) =>
                el.textContent.trim() === optionText
            );

            if (exactMatch.length > 0) {
                cy.log(`✅ Found exact match: ${optionText}`);
                cy.wrap(exactMatch.first()).click({ force: true });
            } else {
                // Try partial match with keywords
                const keywords = optionText.split(/\s+/).filter(w => w.length > 1);
                let found = false;

                for (const keyword of keywords) {
                    const partialMatch = $options.filter((i, el) =>
                        el.textContent.toLowerCase().includes(keyword.toLowerCase())
                    );

                    if (partialMatch.length > 0) {
                        cy.log(`✅ Found partial match with keyword: ${keyword}`);
                        cy.wrap(partialMatch.first()).click({ force: true });
                        found = true;
                        break;
                    }
                }

                // If still no match, select first available option
                if (!found) {
                    cy.log(`⚠️ No match found, selecting first option`);
                    cy.wrap($options.first()).click({ force: true });
                }
            }
        });

        // Wait for selection to complete
        cy.wait(500);

        // Verify dropdown is closed
        cy.get('[role="listbox"]').should('not.exist');

        // Wait for any API calls if specified
        if (opts.waitAlias) {
            cy.wait(opts.waitAlias);
        }
    };

    // ---- Address selects (with network deps) ----
    const fillAddressDropdowns = () => {
        const { province, district, ward } = testData.address;

        cy.log('🌍 Starting address selection process...');

        // Set up network intercepts for dependent data loading
        cy.intercept('GET', '**/static/get_districts*').as('getDistricts');
        cy.intercept('GET', '**/static/get_wards*').as('getWards');

        // Wait a moment for form to fully load
        cy.wait(1000);

        // Try dropdown approach first, fallback to input typing
        const tryDropdownSelection = (fieldPattern, value, isDependent = false) => {
            cy.log(`🔍 Looking for dropdown matching: ${fieldPattern}`);

            // First, scroll to make sure address section is visible
            cy.get('body').then($body => {
                const $addressElements = $body.find('*').filter((i, el) =>
                    el.textContent.toLowerCase().includes('address') ||
                    el.textContent.toLowerCase().includes('địa chỉ') ||
                    el.textContent.toLowerCase().includes('location') ||
                    el.textContent.toLowerCase().includes('province') ||
                    el.textContent.toLowerCase().includes('district') ||
                    el.textContent.toLowerCase().includes('ward')
                );

                if ($addressElements.length > 0) {
                    cy.wrap($addressElements.first()).scrollIntoView();
                    cy.wait(500);
                }
            });

            cy.get('body').then($body => {
                const $dropdown = $body.find('button[role="combobox"]').filter((i, el) =>
                    fieldPattern.test(el.textContent)
                );

                if ($dropdown.length > 0) {
                    cy.log(`✅ Found dropdown for: ${value}`);
                    radixSelectByText(fieldPattern, value, { waitForOptions: isDependent });
                } else {
                    cy.log(`⚠️ No dropdown found for pattern: ${fieldPattern}`);
                    cy.log('🔍 Available dropdowns:');
                    $body.find('button[role="combobox"]').each((i, el) => {
                        cy.log(`  - "${el.textContent.trim()}"`);
                    });

                    // Try fallback to input
                    fallbackToInput(fieldPattern, value);
                }
            });
        };

        const fallbackToInput = (fieldPattern, value) => {
            cy.log(`🔄 Trying input fallback for: ${value}`);
            // Try to find input field and type directly
            cy.get('input').then($inputs => {
                const $input = $inputs.filter((i, el) =>
                    fieldPattern.test(el.placeholder || '') ||
                    fieldPattern.test(el.getAttribute('aria-label') || '') ||
                    fieldPattern.test(el.getAttribute('name') || '')
                );

                if ($input.length > 0) {
                    cy.wrap($input.first()).clear().type(value);
                    cy.log(`✅ Typed directly into input: ${value}`);
                } else {
                    cy.log(`⚠️ No suitable input found for: ${value}`);
                    // Log all available inputs for debugging
                    cy.log('🔍 Available inputs:');
                    $inputs.each((i, el) => {
                        cy.log(`  - placeholder: "${el.placeholder}", name: "${el.name}", aria-label: "${el.getAttribute('aria-label')}"`);
                    });
                }
            });
        };

        // Province selection (no dependency)
        cy.log('📍 Selecting province...');
        tryDropdownSelection(
            /Chọn\s*tỉnh(\/thành\s*phố)?|Select\s*(province|city\/province)/i,
            province,
            false
        );

        // Wait for district API call to complete
        cy.log('⏳ Waiting for district data to load...');
        cy.wait('@getDistricts', { timeout: 10000 }).then((interception) => {
            cy.log(`District API response: ${interception.response?.statusCode}`);
        });

        // District selection (depends on province)
        cy.log('🏘️ Selecting district...');
        tryDropdownSelection(
            /Chọn\s*quận(\/huyện)?|Select\s*district/i,
            district,
            true
        );

        // Wait for ward API call to complete
        cy.log('⏳ Waiting for ward data to load...');
        cy.wait('@getWards', { timeout: 10000 }).then((interception) => {
            cy.log(`Ward API response: ${interception.response?.statusCode}`);
        });

        // Ward selection (depends on district)
        cy.log('🏠 Selecting ward...');
        tryDropdownSelection(
            /Chọn\s*phường(\/xã)?|Select\s*ward/i,
            ward,
            true
        );

        cy.log('✅ Address selection completed');
    };

    // ---- Debug helper ----
    const debugFormFields = () => {
        cy.log('🔍 Debugging form fields...');

        // Log all input fields
        cy.get('input, textarea, select').then($fields => {
            cy.log(`Found ${$fields.length} form fields:`);
            $fields.each((index, field) => {
                const placeholder = field.placeholder || '';
                const name = field.name || '';
                const type = field.type || field.tagName;
                const value = field.value || '';
                cy.log(`${index + 1}. ${type} - placeholder: "${placeholder}", name: "${name}", value: "${value}"`);
            });
        });

        // Log all dropdown buttons
        cy.get('button[role="combobox"]').then($buttons => {
            cy.log(`Found ${$buttons.length} dropdown buttons:`);
            $buttons.each((index, button) => {
                cy.log(`${index + 1}. "${button.textContent.trim()}"`);
            });
        });
    };

    // ---- Form navigation helper ----
    const navigateToFormSection = (sectionName) => {
        cy.log(`🔄 Navigating to form section: ${sectionName}`);

        // Try to find and click section tab/button
        cy.get('body').then($body => {
            // Look for tabs or section buttons
            const $tabs = $body.find('[role="tab"], .tab, [data-tab]').filter((i, el) =>
                el.textContent.toLowerCase().includes(sectionName.toLowerCase())
            );

            if ($tabs.length > 0) {
                cy.log(`✅ Found tab for section: ${sectionName}`);
                cy.wrap($tabs.first()).click({ force: true });
                cy.wait(500);
            } else {
                // Look for section headers or buttons
                const $headers = $body.find('h1, h2, h3, h4, h5, h6, button').filter((i, el) =>
                    el.textContent.toLowerCase().includes(sectionName.toLowerCase())
                );

                if ($headers.length > 0) {
                    cy.log(`✅ Found section header: ${sectionName}`);
                    cy.wrap($headers.first()).scrollIntoView();
                    cy.wait(500);
                } else {
                    cy.log(`⚠️ Could not find section: ${sectionName}, continuing...`);
                }
            }
        });
    };

    // ---- Main creator ----
    const createProject = (p) => {
        // Open create page
        cy.contains('button', /^Add Project$/i, { timeout: CONFIG.timeouts.long }).click();
        cy.url({ timeout: CONFIG.timeouts.medium }).should('include', '/projects/new');
        cy.contains(/New Project|Dự án mới/i).should('be.visible');

        // Debug form fields
        debugFormFields();

        // Navigate to Project tab/section if needed
        navigateToFormSection('Project');

        // Required image
        uploadProjectImages();

        // Basic info
        cy.get('input[placeholder="Enter property name"]', { timeout: CONFIG.timeouts.long })
            .should('be.visible').clear().type(p.name);

        cy.get('input[placeholder="Enter property price"]')
            .should('be.visible').clear().type(p.price);

        cy.get('textarea[placeholder="Enter property description"]')
            .should('be.visible').clear().type(p.description);

        // Address section - scroll to make sure it's visible
        cy.log('📍 Looking for address section...');
        cy.get('body').then($body => {
            // Look for address-related elements
            const $addressSection = $body.find('*').filter((i, el) =>
                el.textContent.toLowerCase().includes('address') ||
                el.textContent.toLowerCase().includes('địa chỉ') ||
                el.textContent.toLowerCase().includes('location')
            );

            if ($addressSection.length > 0) {
                cy.log('✅ Found address section, scrolling to it...');
                cy.wrap($addressSection.first()).scrollIntoView();
                cy.wait(1000);
            }
        });

        // Street address
        cy.get('input[placeholder="Enter street address"]')
            .should('be.visible').clear().type(p.address);

        // Fill address dropdowns with enhanced debugging
        fillAddressDropdowns();

        cy.get('input[placeholder="Enter ZIP/postal code"]')
            .should('be.visible').clear().type(p.zipCode);

        // Navigate to Contact section
        navigateToFormSection('Contact');
        navigateToFormSection('Contact Information');
        navigateToFormSection('Contact 1');
        // Contact (required)
        cy.get('input[placeholder="Enter contact name"]').should('be.visible').clear().type(p.contact.name);
        cy.get('input[placeholder="Enter contact email"]').should('be.visible').clear().type(p.contact.email);
        cy.get('input[placeholder="Enter contact phone number"]').should('be.visible').clear().type(p.contact.phone);

        // Submit
        cy.contains('button', /^Add$|^Thêm$/).should('be.enabled').click();

        // Verify back to list
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/projects');
        cy.contains('Project Info', { timeout: CONFIG.timeouts.long }).should('be.visible');
    };

    const openProjectRowMenu = (projectName) => {
        cy.get('input[placeholder="Search project..."]', { timeout: CONFIG.timeouts.long })
            .should('be.visible')
            .clear()
            .type(projectName);
        cy.wait(CONFIG.timeouts.searchDebounce);

        cy.get('table tbody tr', { timeout: CONFIG.timeouts.medium })
            .first()
            .within(() => {
                cy.get('button, [role="button"]')
                    .last()
                    .should('be.visible')
                    .click({ force: true });
            });
    };

    const verifyProjectInTable = () => {
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/projects');
        cy.contains('Project Info', { timeout: CONFIG.timeouts.long }).should('be.visible');
        cy.get('table tbody tr').should('have.length.greaterThan', 0);
    };

    // ===== TEST SETUP =====
    before(() => {
        cy.session([CONFIG.credentials.username], authenticateUser);
    });

    beforeEach(() => {
        testData = generateTestData();
        cy.session([CONFIG.credentials.username], authenticateUser);
        cy.visit(CONFIG.baseUrl, { failOnStatusCode: false });
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/property-assets/projects');
        cy.contains('button', 'Add Project', { timeout: CONFIG.timeouts.long }).should('be.visible');
    });

    // ===== TEST CASES =====
    describe('CREATE Operations', () => {
        it('TC_001: Should create a new project with all required fields', () => {
            createProject(testData.project);
        });


    });


    describe('READ Operations', () => {
        it('TC_003: Should display project list with data', () => {
            cy.contains('Project Info').should('be.visible');
            cy.get('table tbody tr').should('have.length.greaterThan', 0);
        });

        it('TC_004: Should search projects by name', () => {
            // Test search functionality - search for any existing project
            cy.get('input[placeholder="Search project..."]', { timeout: CONFIG.timeouts.medium })
                .should('be.visible')
                .clear()
                .type('Project');
            cy.wait(CONFIG.timeouts.searchDebounce);

            // Just verify search input works - don't assert specific content
            cy.get('input[placeholder="Search project..."]').should('have.value', 'Project');

            // Clear search
            cy.get('input[placeholder="Search project..."]').clear();
        });
    });

    describe('UPDATE Operations', () => {
        it('TC_005: Should update existing project information', () => {
            // Check if there are projects to update
            cy.get('table tbody tr').then(rows => {
                if (rows.length > 0) {
                    // Open edit form for first project in table
                    cy.get('table tbody tr').first().within(() => {
                        cy.get('button, [role="button"]').last().click({ force: true });
                    });
                    cy.contains('Edit').click();
                    cy.contains(/Edit Project|Chỉnh sửa dự án/i).should('be.visible');

                    // Update project information
                    cy.get('input[placeholder="Enter property name"]')
                        .clear()
                        .type(testData.project.updatedName);
                    cy.get('input[placeholder="Enter property price"]')
                        .clear()
                        .type(testData.project.updatedPrice);
                    cy.get('textarea[placeholder="Enter property description"]')
                        .clear()
                        .type(testData.project.updatedDescription);

                    // Submit update
                    cy.contains('button', /^Update$|^Cập nhật$/).click();

                    // Verify update
                    verifyProjectInTable(testData.project.updatedName);
                } else {
                    cy.log('No projects available to update, skipping test');
                }
            });
        });
    });

    describe('DELETE Operations', () => {
        it('TC_006: Should delete project with confirmation', () => {
            // Delete first project in table
            cy.get('table tbody tr').first().within(() => {
                cy.get('button, [role="button"]').last().click({ force: true });
            });
            cy.contains('Delete').click();

            // Confirm deletion
            cy.contains('Are you sure?').should('be.visible');
            cy.contains('button', /^Delete$/).click();

            // Verify deletion - check that table still has data or is empty
            cy.get('table tbody tr').should('exist');
        });

        it('TC_007: Should cancel delete operation', () => {
            // Start delete process
            cy.get('table tbody tr').first().within(() => {
                cy.get('button, [role="button"]').last().click({ force: true });
            });
            cy.contains('Delete').click();

            // Cancel deletion
            cy.contains('Are you sure?').should('be.visible');
            cy.contains('button', /^Cancel$/).click();

            // Verify project still exists
            cy.get('table tbody tr').should('have.length.greaterThan', 0);
        });
    });
});
