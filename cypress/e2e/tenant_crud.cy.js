
describe('Tenants - CRUD happy path (stable selectors)', () => {
    const CONFIG = {
        baseUrl: 'https://onex-bots-515bdxby7-lebinhnguyens-projects.vercel.app/property-assets/tenants',
        loginUrl: 'https://onex-bots-515bdxby7-lebinhnguyens-projects.vercel.app',
        credentials: {
            username: 'onexapis_admin',
            password: 'Admin@123',
        },
        timeouts: {
            short: 5_000,
            medium: 12_000,
            long: 25_000,
        },
    };

    const genData = () => {
        const rand = Math.random().toString(36).slice(2, 7);
        const phone = '09' + Math.floor(10000000 + Math.random() * 90000000);
        return {
            fullName: `Tenant_${rand}`,
            username: `user_${rand}`,
            password: 'Test@1234',
            email: `tenant_${rand}@example.com`,
            company: `Company_${rand}`,
            emergencyName: `Contact_${rand}`,
            emergencyPhone: '08' + Math.floor(10000000 + Math.random() * 90000000),
            idNumber: Math.floor(100000000 + Math.random() * 900000000).toString(),
            income: Math.floor(500 + Math.random() * 1000).toString(),
            phone,
            countryQuery: 'Viet', // will type then press Enter
            gender: 'Male',
            idType: 'ID Card',
            birthday: '1990-01-01',
        };
    };

    const testData = genData();

    // ---------- Helpers (stable & semantic) ----------
    const goToTenants = () => {
        cy.visit(CONFIG.baseUrl);
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/tenants');
        cy.get('table', { timeout: CONFIG.timeouts.medium }).should('exist');
    };

    const loginOnce = () => {
        cy.session(
            ['onex-session', CONFIG.credentials.username],
            () => {
                cy.visit(CONFIG.loginUrl);
                cy.get('input[name="username"]', { timeout: CONFIG.timeouts.medium })
                    .should('be.visible')
                    .type(CONFIG.credentials.username, { log: false });
                cy.get('input[name="password"]').should('be.visible').type(CONFIG.credentials.password, { log: false });
                cy.get('button[type="submit"]').click();
                cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/dashboard');
            },
            {
                validate() {
                    cy.visit(CONFIG.loginUrl + '/dashboard');
                    cy.url().should('include', '/dashboard');
                },
            }
        );
    };

    const rowByName = (name) =>
        cy.contains('table tr td, table a, table span', name, { matchCase: false }).closest('tr');

    const openRowMenu = (row) =>
        row.then(($r) => {
            const wrapped = cy.wrap($r);
            const selectors = [
                '[aria-haspopup="menu"]',
                '[data-testid*="row-actions"]',
                'td:last-child button',
                'td:last-child [role="button"]',
                'button[aria-label*="More"]',
                'button[aria-label*="Action"]',
                'button:has(svg)'
            ].join(', ');

            // Make any hover-only controls visible
            wrapped.trigger('mouseover');

            // Scope querying inside the row to avoid detached subject issues
            wrapped.within(() => {
                cy.get('td').should('exist');
                cy.get(selectors).then(($btns) => {
                    if ($btns && $btns.length) {
                        cy.wrap($btns.last()).scrollIntoView().should('be.enabled').click({ force: true });
                    } else {
                        // Reveal actions by clicking the rightmost cell, then try again
                        cy.get('td').last().scrollIntoView().click({ force: true });
                        cy.wait(80);
                        cy.get(selectors).then(($retry) => {
                            if ($retry && $retry.length) {
                                cy.wrap($retry.last()).scrollIntoView().click({ force: true });
                            } else {
                                // Final fallback: click near the right edge of the row to hit overlay kebab button
                                cy.root().then(($root) => {
                                    const rect = $root[0].getBoundingClientRect();
                                    const x = Math.max(5, rect.width * 0.97);
                                    const y = Math.max(5, rect.height * 0.5);
                                    cy.wrap($root).click(x, y, { force: true });
                                });
                            }
                        });
                    }
                });
            });
        });

    const pickFromMenu = (label) => {
        const menuSelector = 'div[role="menu"],[data-radix-menu-content],[data-radix-popper-content-wrapper]';
        cy.get('body').find(menuSelector).should('exist');
        cy.get(menuSelector)
            .filter(':visible')
            .should('be.visible')
            .then(($menus) => {
                if ($menus && $menus.length) {
                    cy.wrap($menus.first())
                        .contains('button, a, *', label, { matchCase: false })
                        .scrollIntoView()
                        .click({ force: true });
                } else {
                    cy.contains('body', label, { matchCase: false }).click({ force: true });
                }
            });
    };

    const clickInDialog = (labelRegex) => {
        cy.get('body').then(($body) => {
            const dialog = $body.find('[role="dialog"],[role="alertdialog"],.dialog,.DialogContent');
            if (dialog.length) {
                cy.wrap(dialog)
                    .contains('*', labelRegex)
                    .click({ force: true });
            } else {
                cy.contains('body', labelRegex).click({ force: true });
            }
        });
    };

    const typeIfVisible = (selector, value) =>
        cy.get(selector).should('be.visible').click({ force: true }).clear({ force: true }).type(value, { force: true });

    // ---------- Test flow ----------
    it('does Create → View → Update → Delete in one pass', () => {
        loginOnce();
        goToTenants();

        // ===== CREATE =====
        cy.log('🚀 Create tenant');

        // Click "+ Add" and open create page (from tenant.cy.js)
        cy.get('body').then(($body) => {
            const addButton = $body.find('button:contains("+ Add"), button:contains("Add"), [data-testid*="add"], .add-button').first();

            if (addButton.length) {
                cy.wrap(addButton)
                    .should('be.visible')
                    .should('not.be.disabled')
                    .scrollIntoView()
                    .click({ force: true });
            } else {
                cy.contains('button', '+ Add', { timeout: 15000 })
                    .should('be.visible')
                    .should('not.be.disabled')
                    .scrollIntoView()
                    .click({ force: true });
            }
        });

        cy.url().should('include', '/tenants/new');

        // Wait for form to load completely and verify we're on the right page
        cy.get('form, .form, [role="form"]', { timeout: 10000 }).should('exist');

        // Additional verification that we're on the tenant creation page, not login
        cy.get('body').should('not.contain', 'Login');
        cy.get('body').should('not.contain', 'Enter your username or email');

        // Wait for the form to be fully interactive
        cy.wait(2000);

        // Ready to fill the form

        // Fill form fields with improved selectors
        cy.get('input[placeholder="Enter full name"]').type(testData.fullName);
        cy.get('input[placeholder="Enter phone"]').type(testData.phone);
        cy.get('input[placeholder="Enter email"]').type(testData.email);

        // Handle Country selection (required field)
        cy.get('div').contains('Select a country').click();
        cy.wait(1000);
        cy.get('input[placeholder*="Search"]').type('Viet');
        cy.wait(1000);
        cy.contains('VietNam').click({ force: true });


        // Handle Gender selection (required field)
        cy.get('div').contains('Select gender').click();
        cy.contains('Male').click();

        // Handle ID Type selection (required field)
        cy.get('body').then(($body) => {
            const idTypeField = $body.find('*:contains("ID Type"), *:contains("ID type"), *:contains("Identification Type")').closest('div').find('input, [role="combobox"], [role="button"]').first();
            if (idTypeField.length) {
                cy.wrap(idTypeField)
                    .scrollIntoView()
                    .click({ force: true });
                cy.wait(1000);

                // Try to select ID type with fallback
                cy.get('body').then(($body) => {
                    const idTypeOption = $body.find('*:contains("ID Card"), *:contains("ID"), *:contains("Card")').first();
                    if (idTypeOption.length) {
                        cy.wrap(idTypeOption).click({ force: true });
                        cy.log('✅ Selected ID Card');
                    } else {
                        // Select first available option
                        const firstOption = $body.find('[role="option"], .option, li, div').filter((i, el) =>
                            el.innerText && el.innerText.trim().length > 0
                        ).first();
                        if (firstOption.length) {
                            cy.wrap(firstOption).click({ force: true });
                            cy.log('✅ Selected first ID type option');
                        }
                    }
                });
            }
        });

        // Handle Birthday field (required field)
        cy.get('body').then(($body) => {
            const birthdayField = $body.find('input[type="date"], input[placeholder*="birthday"], input[placeholder*="Birthday"], input[placeholder*="date of birth"]').first();
            if (birthdayField.length) {
                cy.wrap(birthdayField)
                    .scrollIntoView()
                    .should('be.enabled')
                    .click({ force: true })
                    .type(testData.birthday, { force: true });
            }
        });

        // Handle identification number field - more specific selector, ensure overlay is closed
        cy.get('body').type('{esc}', { force: true });
        cy.get('input[placeholder*="identification number"], input[placeholder*="Identification Number"]')
            .first()
            .scrollIntoView()
            .should('be.enabled')
            .click({ force: true })
            .type(testData.idNumber, { force: true });

        // Handle username - try multiple robust selectors with fallback by label
        cy.get('body').then(($body) => {
            const usernameCandidate = $body.find(
                'input[name="username"], input#username, input[placeholder*="username"], input[placeholder*="Username"], input[aria-label*="username"], input[aria-label*="Username"]'
            ).first();

            if (usernameCandidate.length) {
                cy.wrap(usernameCandidate)
                    .scrollIntoView()
                    .should('be.enabled')
                    .click({ force: true })
                    .type(testData.username, { force: true });
            } else {
                cy.contains('label', 'Username', { matchCase: false })
                    .parent()
                    .find('input')
                    .first()
                    .scrollIntoView()
                    .should('be.enabled')
                    .click({ force: true })
                    .type(testData.username, { force: true });
            }
        });

        // Handle password - align with real UI: the input under Account -> Password
        cy.get('body').then(($body) => {
            let passwordCandidate = $body.find(
                'input[type="password"], input[name="password"], input#password, input[placeholder*="password"], input[placeholder*="Password"], input[aria-label*="password"], input[aria-label*="Password"]'
            ).first();

            if (!passwordCandidate.length) {
                // Narrow to the Account section and select input near the Password label
                const accountSection = $body.find('*:contains("Account"):last').closest('section, div, form');
                if (accountSection.length) {
                    const byLabel = accountSection.find('label:contains("Password")').first();
                    if (byLabel.length) {
                        const inputNearLabel = byLabel.parent().find('input[type="password"], input').first();
                        if (inputNearLabel.length) passwordCandidate = inputNearLabel;
                    }
                }
            }

            // Final fallback: the first enabled password-like input on the page
            if (!passwordCandidate.length) {
                passwordCandidate = $body.find('input[type="password"], input[autocomplete="new-password"], input[autocomplete="current-password"]').first();
            }

            cy.wrap(passwordCandidate)
                .scrollIntoView()
                .should('exist')
                .should('be.enabled')
                .click({ force: true })
                .type(testData.password, { force: true });
        });

        // Handle company name
        cy.get('input[placeholder*="company"], input[placeholder*="Company"]')
            .first()
            .should('be.visible')
            .click({ force: true })
            .type(testData.company, { force: true });

        // Handle income field - with better error handling
        cy.get('body').then(($body) => {
            const incomeField = $body.find('input[placeholder*="income"], input[placeholder*="Income"]').first();

            if (incomeField.length > 0) {
                cy.log('✅ Found income field');
                cy.wrap(incomeField)
                    .should('be.visible')
                    .click({ force: true })
                    .clear({ force: true })
                    .type(testData.income, { force: true });
            } else {
                cy.log('⚠️ Income field not found, checking for alternative selectors');
                // Try alternative selectors for income field
                const altIncomeField = $body.find('input[placeholder*="salary"], input[placeholder*="Salary"], input[placeholder*="wage"], input[placeholder*="Wage"]').first();

                if (altIncomeField.length > 0) {
                    cy.log('✅ Found alternative income field');
                    cy.wrap(altIncomeField)
                        .should('be.visible')
                        .click({ force: true })
                        .clear({ force: true })
                        .type(testData.income, { force: true });
                } else {
                    cy.log('❌ No income field found, skipping this field');
                    // Take screenshot for debugging
                    cy.screenshot('income-field-not-found');
                }
            }
        });

        // Handle emergency contact fields
        cy.get('input[placeholder*="Emergency"], input[placeholder*="emergency"]')
            .first()
            .should('be.visible')
            .click({ force: true })
            .type(testData.emergencyName, { force: true });

        cy.get('input[placeholder*="Emergency"], input[placeholder*="emergency"]')
            .last()
            .should('be.visible')
            .click({ force: true })
            .type(testData.emergencyPhone, { force: true });

        // Submit
        cy.contains('button', /^Add$/).click({ force: true });

        // Wait for success toast before navigating away
        cy.contains('body', 'Create tenant successfully', { timeout: CONFIG.timeouts.long })
            .should('be.visible');

        // Return to list by clicking breadcrumb "Tenants" (more reliable than history)
        cy.contains('nav a, header a, a, button, span', 'Tenants', { matchCase: false })
            .first()
            .click({ force: true });

        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/tenants');
        cy.get('table', { timeout: CONFIG.timeouts.medium }).should('exist');

        // Wait for the newly created tenant to appear; if not, refresh list once
        cy.get('body', { timeout: CONFIG.timeouts.medium }).then(($b) => {
            const visible = $b.text().includes(testData.fullName);
            if (!visible) {
                cy.log('⚠️ Newly created tenant not visible yet. Refreshing list...');
                cy.intercept('GET', '**/property-assets/tenants*').as('tenantsList');
                cy.visit(CONFIG.baseUrl);
                cy.wait('@tenantsList', { timeout: CONFIG.timeouts.long });
                cy.get('table', { timeout: CONFIG.timeouts.medium }).should('exist');
            }
        });

        // Now search and ensure the row exists
        cy.get('input[placeholder*="Search" i]').clear().type(testData.fullName);
        cy.wait(800);
        rowByName(testData.fullName).should('exist');

        // ===== VIEW =====
        cy.log('👁️ View tenant details');
        rowByName(testData.fullName).then(($tr) => {
            openRowMenu(cy.wrap($tr));
        });
        pickFromMenu('View');

        // Ensure we navigated to detail page; fallback to clicking the name cell if needed
        cy.url({ timeout: CONFIG.timeouts.long }).then((href) => {
            const onDetail = /\/tenants\/[^/]+$/.test(href);
            if (!onDetail) {
                rowByName(testData.fullName)
                    .within(() => {
                        cy.contains('a, button, span, td', testData.fullName, { matchCase: false })
                            .first()
                            .click({ force: true });
                    });
            }
        });

        cy.url({ timeout: CONFIG.timeouts.long }).should('match', /\/tenants\/[^/]+$/);
        cy.contains(testData.fullName).should('be.visible');

        // Back to list via breadcrumb "Tenants" to continue Edit step
        cy.contains('nav a, header a, a, button, span', 'Tenants', { matchCase: false })
            .first()
            .click({ force: true });
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/tenants');

        // ===== UPDATE =====
        cy.log('✏️ Update tenant name');
        const updatedName = `${testData.fullName}_Updated`;

        cy.get('input[placeholder*="Search" i]').clear().type(testData.fullName);
        cy.wait(600);
        rowByName(testData.fullName).then(($tr) => {
            openRowMenu(cy.wrap($tr));
        });
        pickFromMenu('Edit');

        // Ensure we navigated to EDIT page; if not, reopen menu and click Edit again
        cy.url({ timeout: CONFIG.timeouts.long }).then((href) => {
            const onEdit = /\/tenants\/[^/]+\/edit/.test(href);
            if (!onEdit) {
                rowByName(testData.fullName).then(($tr) => {
                    openRowMenu(cy.wrap($tr));
                    pickFromMenu('Edit');
                });
            }
        });

        cy.url({ timeout: CONFIG.timeouts.long }).should('match', /\/tenants\/[^/]+\/edit/);
        // Wait for edit form to be ready
        cy.contains('button', /Save changes/i, { timeout: CONFIG.timeouts.medium }).should('be.visible');
        typeIfVisible('input[placeholder="Enter full name"]', updatedName);

        cy.contains('button', /Save changes/i).click({ force: true });

        // Wait for update/save success toast before leaving detail
        cy.contains('body', /(Update tenant successfully|Update successfully|updated|Save changes successfully|saved|success)/i, {
            timeout: CONFIG.timeouts.long,
        }).should('be.visible');

        // Wait for success toast to disappear before proceeding
        cy.contains('body', /(Update tenant successfully|Update successfully|updated|Save changes successfully|saved|success)/i, {
            timeout: CONFIG.timeouts.long,
        }).should('not.exist');

        // Always return to list after edit: try breadcrumb, else direct visit
        cy.contains('nav a, header a, a, button, span', 'Tenants', { matchCase: false, timeout: 2000 })
            .then(($el) => {
                if ($el && $el.length) {
                    cy.wrap($el.first()).click({ force: true });
                } else {
                    cy.visit(CONFIG.baseUrl);
                }
            });

        // Ensure we are back on the list before proceeding to Delete step
        cy.url({ timeout: CONFIG.timeouts.long }).should('include', '/tenants');
        cy.get('table', { timeout: CONFIG.timeouts.medium }).should('exist');


        // ===== DELETE 1: Xóa tenant đã update =====
        cy.log('🗑️ Delete the updated tenant');

        // Tìm tenant đã update để xóa
        cy.log(`Looking for updated tenant: ${updatedName}`);

        // Tìm kiếm tenant đã update
        cy.get('input[placeholder*="Search" i]').clear().type(updatedName);
        cy.wait(1000);

        // Lấy hàng chứa tenant đã update
        rowByName(updatedName).as('rowToDelete');
        cy.get('@rowToDelete').find('td, a, span').first().invoke('text').then((t) => {
            const name = (t || '').trim();
            cy.wrap(name).as('deletedName');
            cy.log(`Will delete updated tenant: ${name}`);
        });

        // Thực hiện xóa tenant đã update
        performDelete();

        // Xác minh tenant đã update đã bị xóa
        cy.get('@deletedName').then((deletedName) => {
            const q = String(deletedName || '').trim();
            if (q.length > 0) {
                cy.log(`Verifying updated tenant "${q}" has been deleted`);
                cy.get('input[placeholder*="Search" i]').clear().type(q);
                cy.wait(1000);
                cy.get('table tbody tr').should('not.contain', q);
                cy.log(`✅ Updated tenant "${q}" successfully deleted`);
            }
        });

        cy.log('🎉 CRUD test completed successfully!');
    });

    // Helper function for delete operations
    const performDelete = () => {
        // Theo dõi API DELETE (hỗ trợ cả 2 đường dẫn backend khả dụng)
        // - property-assets/tenants/:id (FE naming)
        // - actor/customers/:id (BE naming)
        cy.intercept({ method: 'DELETE', url: /\/(property-assets\/tenants|actor\/customers)\// }).as('deleteTenant');

        // Mở menu và chọn Delete
        cy.get('@rowToDelete').then(($tr) => {
            openRowMenu(cy.wrap($tr));
        });
        pickFromMenu('Delete');

        // Đợi dialog xác nhận xuất hiện và xác nhận xóa
        cy.get('body').then(($body) => {
            const dialog = $body.find('[role="alertdialog"],[role="dialog"],.DialogContent,.modal,.alert-dialog').filter(':visible');
            if (dialog.length) {
                cy.wrap(dialog.last())
                    .should('be.visible')
                    .within(() => {
                        cy.get('button, [role="button"], a')
                            .contains(/^(Delete|Confirm|Yes|OK)$/i)
                            .should('be.visible')
                            .click({ force: true });
                    });
            } else {
                cy.contains('button, [role="button"], a', /^(Delete|Confirm|Yes|OK)$/i, { timeout: 4000 })
                    .should('be.visible')
                    .click({ force: true });
            }
        });

        // Đợi API DELETE thành công
        cy.wait('@deleteTenant', { timeout: CONFIG.timeouts.long })
            .its('response.statusCode')
            .should('be.oneOf', [200, 204]);

        // Đợi thông báo xóa thành công xuất hiện
        cy.contains('body', /(Delete customer successfully|Delete tenant successfully|Delete successfully|deleted successfully|successfully deleted)/i, {
            timeout: CONFIG.timeouts.long,
        }).should('be.visible');

        // Đợi thông báo thành công biến mất
        cy.contains('body', /(Delete customer successfully|Delete tenant successfully|Delete successfully|deleted successfully|successfully deleted)/i, {
            timeout: CONFIG.timeouts.long,
        }).should('not.exist');


        // Quay về danh sách tenant sau khi xóa
        cy.log('Returning to tenant list after deletion');
        cy.intercept('GET', '**/property-assets/tenants*').as('tenantsListAfter');
        cy.reload();
        cy.wait('@tenantsListAfter', { timeout: CONFIG.timeouts.long });
        cy.get('table', { timeout: CONFIG.timeouts.medium }).should('exist');
    };
});
