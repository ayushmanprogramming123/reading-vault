document.addEventListener('DOMContentLoaded', () => {
    let booksData = [];
    let currentCategory = 'all';
    let searchQuery = '';

    const shelvesContainer = document.getElementById('shelvesContainer');
    const searchInput = document.getElementById('searchInput');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const readerDrawer = document.getElementById('readerDrawer');
    const closeDrawerBtn = document.getElementById('closeDrawer');
    const shelfReturnBtn = document.getElementById('shelfReturnBtn');

    // Drawer Elements
    const drawerBookCover = document.getElementById('drawerBookCover');
    const drawerCategory = document.getElementById('drawerCategory');
    const drawerBookTitle = document.getElementById('drawerBookTitle');
    const drawerAuthor = document.getElementById('drawerAuthor');
    const drawerWebsiteBadge = document.getElementById('drawerWebsiteBadge');
    const drawerDate = document.getElementById('drawerDate');
    const drawerTitleHeading = document.getElementById('drawerTitleHeading');
    const drawerAuthorName = document.getElementById('drawerAuthorName');
    const drawerSummaryText = document.getElementById('drawerSummaryText');
    const drawerReadBtn = document.getElementById('drawerReadBtn');

    // Category Display Names Mapping
    const categoryTitles = {
        'ai': 'Artificial Intelligence & Machine Learning',
        'science': 'Computer Science & Software Engineering',
        'self improvement': 'Self Improvement & Personal Growth',
        'brain': 'Brain, Cognition & Philosophy',
        'making money': 'Wealth Creation & Making Money',
        'freelancing': 'Freelancing & Solopreneurship'
    };

    // Load Books from books.json
    async function loadBooks() {
        try {
            const response = await fetch('books.json');
            booksData = await response.json();
            renderShelves();
        } catch (error) {
            console.error('Error loading books.json:', error);
            shelvesContainer.innerHTML = `<div class="text-center text-red-400 py-12">Failed to load library books. Please ensure books.json is in the root directory.</div>`;
        }
    }

    // Render Bookshelves
    function renderShelves() {
        shelvesContainer.innerHTML = '';

        const categoriesToRender = currentCategory === 'all'
            ? Object.keys(categoryTitles)
            : [currentCategory];

        categoriesToRender.forEach(catKey => {
            // Filter books by category and search query
            const filteredBooks = booksData.filter(book => {
                const matchesCategory = book.category === catKey;
                const matchesSearch = searchQuery === '' ||
                    book.title.toLowerCase().includes(searchQuery) ||
                    book.author.toLowerCase().includes(searchQuery) ||
                    book.website.toLowerCase().includes(searchQuery) ||
                    book.summary.toLowerCase().includes(searchQuery);
                return matchesCategory && matchesSearch;
            });

            // If searching and no books match in this category, skip
            if (searchQuery !== '' && filteredBooks.length === 0) return;

            // Create Shelf Section
            const shelfSection = document.createElement('div');
            shelfSection.className = 'space-y-4';

            // Category Header
            const headerDiv = document.createElement('div');
            headerDiv.className = 'flex items-center justify-between border-b border-vault-700 pb-2';
            headerDiv.innerHTML = `
                <div class="flex items-center space-x-2">
                    <div class="w-3 h-3 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
                    <h2 class="text-lg font-bold font-['Cinzel'] tracking-wide text-gray-200">${categoryTitles[catKey]}</h2>
                </div>
                <span class="text-xs text-gray-400 bg-vault-800 px-3 py-1 rounded-full border border-vault-700">${filteredBooks.length} Books</span>
            `;
            shelfSection.appendChild(headerDiv);

            // Bookshelf Track
            const shelfTrack = document.createElement('div');
            shelfTrack.className = 'bookshelf-shelf rounded-2xl p-6 min-h-[320px] flex items-end overflow-x-auto scrollbar-none';

            if (filteredBooks.length === 0) {
                shelfTrack.innerHTML = `<p class="text-xs text-gray-500 italic w-full text-center py-12">No books found matching your query on this shelf.</p>`;
            } else {
                const booksGrid = document.createElement('div');
                booksGrid.className = 'flex items-end gap-5 py-4 min-w-full';

                filteredBooks.forEach(book => {
                    const bookEl = document.createElement('div');
                    bookEl.className = `book-item w-36 lg:w-40 h-64 lg:h-72 rounded-xl bg-gradient-to-b ${book.color} ${book.spineStyle} p-4 flex flex-col justify-between shadow-xl cursor-pointer relative group flex-shrink-0 select-none`;
                    bookEl.setAttribute('data-id', book.id);

                    // Daily pick badge
                    let badgeHtml = book.isDailyPick ? `<span class="absolute -top-2.5 -right-2 bg-amber-500 text-black text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md animate-pulse">NEW DAILY</span>` : '';

                    bookEl.innerHTML = `
                        ${badgeHtml}
                        <div>
                            <span class="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/40 text-white font-semibold">${book.category}</span>
                            <h4 class="text-xs lg:text-sm font-bold font-['Playfair_Display'] mt-3 leading-snug text-white line-clamp-4">${book.title}</h4>
                        </div>
                        <div class="border-t border-white/20 pt-2 mt-auto">
                            <p class="text-[10px] text-gray-200 font-medium truncate">${book.author}</p>
                            <p class="text-[9px] text-gray-300 opacity-80 truncate">${book.website}</p>
                        </div>
                    `;

                    // Click event for Fall Down Animation & Reader View
                    bookEl.addEventListener('click', () => {
                        triggerBookExtraction(book, bookEl);
                    });

                    booksGrid.appendChild(bookEl);
                });

                shelfTrack.appendChild(booksGrid);
            }

            shelfSection.appendChild(shelfTrack);
            shelvesContainer.appendChild(shelfSection);
        });
    }

    // Book Extraction Animation & Drawer Opening
    function triggerBookExtraction(book, bookEl) {
        // Add fall down animation class
        bookEl.classList.add('book-extracting');

        setTimeout(() => {
            bookEl.classList.remove('book-extracting');
            openReaderDrawer(book);
        }, 500);
    }

    // Open Reader Drawer
    function openReaderDrawer(book) {
        drawerCategory.textContent = book.category.toUpperCase();
        drawerBookTitle.textContent = book.title;
        drawerAuthor.textContent = `By ${book.author}`;
        drawerWebsiteBadge.textContent = book.website;
        drawerDate.textContent = `Published: ${book.date}`;
        drawerTitleHeading.textContent = book.title;
        drawerAuthorName.textContent = book.author;
        drawerReadBtn.href = book.url;

        // Apply same gradient color to drawer book preview
        drawerBookCover.className = `w-48 h-64 rounded-xl shadow-2xl p-6 flex flex-col justify-between transform hover:scale-105 transition-transform cursor-pointer border border-white/20 bg-gradient-to-b ${book.color}`;
        drawerBookCover.onclick = () => window.open(book.url, '_blank');

        // Format 5-line summary into list items
        const summaryLines = book.summary.split('\n');
        drawerSummaryText.innerHTML = summaryLines.map(line => `<p class="flex items-start space-x-2"><span class="text-blue-400 font-bold">•</span> <span>${line.replace(/^[0-9]+\.\s*/, '')}</span></p>`).join('');

        // Show drawer and scroll smoothly to it
        readerDrawer.classList.remove('hidden');
        readerDrawer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Close Reader Drawer
    function closeDrawer() {
        readerDrawer.classList.add('hidden');
    }

    closeDrawerBtn.addEventListener('click', closeDrawer);
    shelfReturnBtn.addEventListener('click', closeDrawer);

    // Search Input Listener
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        renderShelves();
    });

    // Category Filter Button Listeners
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            categoryBtns.forEach(b => {
                b.classList.remove('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-600/30');
                b.classList.add('bg-vault-800', 'text-gray-300', 'hover:bg-vault-700');
            });
            btn.classList.add('active', 'bg-blue-600', 'text-white', 'shadow-md', 'shadow-blue-600/30');
            btn.classList.remove('bg-vault-800', 'text-gray-300', 'hover:bg-vault-700');

            currentCategory = btn.getAttribute('data-category');
            renderShelves();
        });
    });

    // Initial Load
    loadBooks();
});
